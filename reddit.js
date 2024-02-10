const snoowrap = require('snoowrap');
const { redditClientId, redditClientSecret, redditRefreshToken, subredditName, redditUserAgent } = require('./config.json');
const RSSParser = require('rss-parser');
const parser = new RSSParser();
const { insertNewPost, checkPostExists } = require('./dbHandler');

const r = new snoowrap({
  userAgent: redditUserAgent,
  clientId: redditClientId,
  clientSecret: redditClientSecret,
  refreshToken: redditRefreshToken,
});

async function fetchNewRedditPosts(subreddit) {
  try {
    const newPosts = await r.getSubreddit(subreddit).getNew();
    return newPosts.map(post => ({
      title: post.title,
      url: post.url,
      author: post.author.name,
      created: new Date(post.created_utc * 1000),
    }));
  } catch (error) {
    console.error('Error fetching new Reddit posts:', error);
    return [];
  }
}

async function checkRssFeedAndPost(client, redditChannelId) {
  const feedUrl = `https://www.reddit.com/r/${subredditName}/.rss`;
  let feed = await parser.parseURL(feedUrl);
  console.log(`Fetched ${feed.items.length} items from RSS feed.`); // Log the number of items fetched

  for (const item of feed.items) {
    try {
      const postIdMatch = item.link.match(/\/comments\/([^\/]+)\//);
      if (!postIdMatch) {
        console.error(`Could not extract post ID from URL: ${item.link}`);
        continue; // Skip this item and continue with the next one
      }
      const postId = postIdMatch[1];
      console.log(`Extracted postId: ${postId}`); // Log the extracted postId

      const exists = await checkPostExists(postId);
      console.log(`Post with ID ${postId} exists in DB: ${exists}`); // Log the result of the check

      if (!exists) {
        const channel = await client.channels.fetch(redditChannelId);
        console.log(`Sending new post to channel ${redditChannelId}`); // Log the channel ID to which the post is being sent

        await channel.send(`New post: ${item.title} ${item.link}`);
        console.log(`Sent post with ID ${postId} to channel`); // Log that the post was sent

        await insertNewPost(postId, item.title, item.link);
        console.log(`Inserted post with ID ${postId} into DB`); // Log that the post was inserted into the DB
      }
    } catch (error) {
      console.error('Error in checkRssFeedAndPost:', error);
    }
  }
}


module.exports = { fetchNewRedditPosts, checkRssFeedAndPost };

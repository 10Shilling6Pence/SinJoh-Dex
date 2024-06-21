const snoowrap = require('snoowrap'); // Import the Snoowrap library for Reddit API interactions
const { redditClientId, redditClientSecret, redditRefreshToken, subredditName, redditUserAgent } = require('./config.json'); // Import Reddit credentials and subreddit name from config
const RSSParser = require('rss-parser'); // Import the RSS Parser library
const parser = new RSSParser(); // Create an instance of the RSS Parser
const { insertNewPost, checkPostExists } = require('./dbHandler'); // Import database functions for posts

// Configure Snoowrap with Reddit API credentials
const r = new snoowrap({
  userAgent: redditUserAgent,
  clientId: redditClientId,
  clientSecret: redditClientSecret,
  refreshToken: redditRefreshToken,
});

// Simple mutex to prevent concurrent executions
let isProcessing = false;

// Function to fetch new posts from a given subreddit
async function fetchNewRedditPosts(subreddit) {
  try {
    // Fetch the newest posts from the subreddit
    const newPosts = await r.getSubreddit(subreddit).getNew();
    // Map the posts to a simplified format
    return newPosts.map(post => ({
      id: post.id,
      title: post.title,
      url: post.url,
      author: post.author.name,
      created: new Date(post.created_utc * 1000),
    }));
  } catch (error) {
    console.error('Error fetching new Reddit posts:', error); // Log errors if fetching fails
    return []; // Return an empty array if an error occurs
  }
}

// Function to check the RSS feed and post new items to a specified Discord channel
async function checkRssFeedAndPost(client, redditChannelId) {
  if (isProcessing) {
    console.log('Already processing, skipping this run.'); // Log and skip if already processing
    return;
  }

  console.log('Starting RSS feed check...');
  isProcessing = true; // Set the processing flag to true
  
  const feedUrl = `https://www.reddit.com/r/${subredditName}/.rss`; // Construct the RSS feed URL
  try {
    let feed = await parser.parseURL(feedUrl); // Fetch and parse the RSS feed
    console.log(`Fetched ${feed.items.length} items from RSS feed.`); // Log the number of items fetched

    for (const item of feed.items) {
      try {
        // Extract the post ID from the item's URL using a regular expression
        const postIdMatch = item.link.match(/\/comments\/([^\/]+)\//);
        if (!postIdMatch) {
          console.error(`Could not extract post ID from URL: ${item.link}`); // Log error if post ID extraction fails
          continue; // Skip this item and continue with the next one
        }
        const postId = postIdMatch[1]; // Extracted post ID
        console.log(`Extracted postId: ${postId}`); // Log the extracted post ID

        const exists = await checkPostExists(postId); // Check if the post already exists in the database
        console.log(`Post with ID ${postId} exists in DB: ${exists}`); // Log the existence check result

        if (!exists) {
          // Fetch the Discord channel to post the new Reddit post
          const channel = await client.channels.fetch(redditChannelId);
          console.log(`Sending new post to channel ${redditChannelId}`); // Log the channel ID to which the post is being sent

          // Send the new post to the channel
          await channel.send(`New post: ${item.title} ${item.link}`);
          console.log(`Sent post with ID ${postId} to channel`); // Log that the post was sent

          // Insert the new post into the database
          await insertNewPost(postId, item.title, item.link);
          console.log(`Inserted post with ID ${postId} into DB`); // Log that the post was inserted into the DB
        } else {
          console.log(`Post with ID ${postId} already exists in DB. Skipping.`); // Log that the post already exists and skip it
        }
      } catch (error) {
        console.error('Error processing item:', error); // Log any errors during item processing
      }
    }
  } catch (error) {
    console.error('Error fetching RSS feed:', error); // Log errors if fetching the RSS feed fails
  } finally {
    isProcessing = false; // Reset the processing flag
    console.log('Finished RSS feed check.');
  }
}

module.exports = { fetchNewRedditPosts, checkRssFeedAndPost }; // Export the functions for use in other modules

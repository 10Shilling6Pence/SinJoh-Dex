const snoowrap = require('snoowrap');
const { redditClientId, redditClientSecret, redditRefreshToken, subredditName, redditUserAgent } = require('./config.json');

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

module.exports = { fetchNewRedditPosts };
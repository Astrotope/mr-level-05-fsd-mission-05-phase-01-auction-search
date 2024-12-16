const prisma = require('../lib/prisma');

async function searchItems(req, res) {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Missing search query',
        message: 'Please provide a search term using the "q" query parameter' 
      });
    }

    // Using Prisma's findRaw to execute MongoDB text search
    const items = await prisma.auctionItem.findRaw({
      filter: {
        $text: {
          $search: q
        }
      },
      options: {
        projection: {
          _id: 1,
          title: 1,
          description: 1,
          start_price: 1,
          reserve_price: 1,
          score: { $meta: "textScore" }
        },
        sort: {
          score: { $meta: "textScore" }
        }
      }
    });

    res.json({ 
      items,
      count: items.length,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
}

module.exports = { searchItems };

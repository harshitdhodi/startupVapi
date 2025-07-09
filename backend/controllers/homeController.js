// Home controller
exports.getHome = (req, res) => {
  try {
    res.render('index', { 
      title: 'Home',
      message: 'Welcome to the Express MVC Application!'
    });
  } catch (error) {
    console.error('Error in getHome:', error);
    res.status(500).send('Internal Server Error');
  }
};

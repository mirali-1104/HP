// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/submit-project", isAuthenticated, (req, res) => {

  res.render("submit-project");
});

router.post(
  "/submit-project",
  isAuthenticated,
  upload.array("project-files"),
  async (req, res) => {
    // ... rest of the code
  }
);

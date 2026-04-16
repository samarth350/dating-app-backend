require('dotenv').config();
const app = require('./src/app');
const likeRoutes = require("./src/routes/likeRoutes");
app.use("/api", likeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
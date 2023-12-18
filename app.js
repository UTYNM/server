import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import authRoute from './prisma/routes/authRoute.js';
import blogRoute from './prisma/routes/blogRoute.js';
import activityRoute from './prisma/routes/activityRoute.js';
import financialRoute from './prisma/routes/financialRoute.js';
import timeRoute from './prisma/routes/timeRoute.js';
import dietRoute from './prisma/routes/dietRoute.js';

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/', authRoute);
app.use('/blog', blogRoute);
app.use('/activity', activityRoute);
app.use('/financial', financialRoute);
app.use('/timeManagement', timeRoute);
app.use('/dietPlan', dietRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});







// AUTH
// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     res.status(400).json({
//       success: false,
//       message: 'name, email and password are required',
//     });
//     return;
//   }
//   const existEmail = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });
//   if (existEmail) {
//     res.status(400).json({
//       success: false,
//       message: 'email already exist',
//     });
//     return;
//   }
//   try {
//     const hash = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: {
//         email,
//         name,
//         password: hash,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     res.status(400).json({
//       success: false,
//       message: 'email and password are required',
//     });
//     return;
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (!user) {
//     res.status(401).json({
//       success: false,
//       message: 'Email or password is incorrect',
//     });
//     return;
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     res.status(401).json({
//       success: false,
//       message: 'Email or password is incorrect',
//     });
//     return;
//   }

//   const token = generateToken(user);
//   res.status(200).json({
//     success: true,
//     data: {
//       user: {
//         name: user.name,
//         email: user.email,
//       },

//       token,
//       expiresIn: '3600',
//     },
//   });
// });

// BLOG
// app.get('/blog', async (req, res) => {
//   try {
//     const blogs = await prisma.blog.findMany({
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         image: true,
//         author: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     res.status(200).json({
//       success: true,
//       data: blogs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// app.get('/blog/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const blog = await prisma.blog.findUnique({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         image: true,
//         author: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     res.status(200).json({
//       success: true,
//       data: blog,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// app.post('/blog', authenticateToken, async (req, res) => {
//   const { title, content, image } = req.body;
//   if (!title || !content || !image) {
//     res.status(400).json({
//       success: false,
//       message: 'title, content and image are required',
//     });
//     return;
//   }
//   const { id: authorId, name } = req.user;
//   try {
//     const newBlog = await prisma.blog.create({
//       data: {
//         title,
//         content,
//         image,
//         authorId,
//       },
//     });

//     res.json({
//       success: true,
//       data: {
//         title: newBlog.title,
//         content: newBlog.content,
//         author: name,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// app.delete('/blog/:id', authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const isBlogAvailable = await prisma.blog.findUnique({
//     where: {
//       id,
//     },
//   });
//   if (!isBlogAvailable) {
//     res.status(404).json({
//       success: false,
//       message: 'Blog not found',
//     });
//     return;
//   }
//   try {
//     const blog = await prisma.blog.delete({
//       where: {
//         id,
//       },
//     });
//     res.status(200).json({
//       success: true,
//       message: 'Blog deleted successfully',
//       data: blog,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// app.put('/blog/:id', authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const { title, content, image } = req.body;
//   const isBlogAvailable = await prisma.blog.findUnique({
//     where: {
//       id,
//     },
//   });
//   if (!isBlogAvailable) {
//     res.status(404).json({
//       success: false,
//       message: 'Blog not found',
//     });
//     return;
//   }
//   if (!title || !content || !image) {
//     res.status(400).json({
//       success: false,
//       message: 'title, content and image are required',
//     });
//     return;
//   }
//   try {
//     const blog = await prisma.blog.update({
//       where: {
//         id,
//       },
//       data: {
//         title,
//         content,
//         image,
//       },
//     });
//     res.status(200).json({
//       success: true,
//       message: 'Blog updated successfully',
//       data: blog,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });


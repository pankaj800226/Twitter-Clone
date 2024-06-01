import express, { json } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import Path from 'path';
import dotenv from 'dotenv';
import { postModel } from './model/post.js';
import http from 'http'
import { Server } from 'socket.io'

dotenv.config();

const PORT = process.env.PORT || 8000

//meddleware
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'))

//mogoDB database
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log('database connection');
} catch (error) {
  console.log(error);
}

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'PUT'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log(socket.id);
  console.log('user connected');

  socket.on('join_room', (data) => {
    socket.join(data)
    console.log(`User with ID ${socket.id} joined room : ${data}`);
  })

  socket.on('send_message', (data) => {
    // console.log(`Message from ${data.auther}: ${data.message} to room ${data.room}`);
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

  })
})



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + Path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    const { filename } = req.file;
    const post = await postModel.create({ photo: filename, title });
    res.json(post)
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }

})

app.post('/allData', async (req, res) => {
  try {
    const post = await postModel.find().sort({ createdAt: - 1 })
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);

  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });
  }

})

app.delete('/delete/:id', async (req, res) => {

  const { id } = req.params
  try {
    const post = await postModel.findByIdAndDelete(id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });

  }
})

app.put('/edit/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await postModel.findByIdAndUpdate(id, {
      title: req.body.title,
    })
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });
  }

})


app.post('/getRoute/:id', async (req, res) => {
  const { id } = req.params

  try {
    const post = await postModel.findById(id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });

  }

})

app.post('/comment/:id', async (req, res) => {
  const { id } = req.params
  const { comment } = req.body

  try {
    const post = await postModel.findById(id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });

    } else {
      post.comments.push(comment)
      await post.save()
    }
    res.json(post)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });

  }

})


app.post('/postLike/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await postModel.findById(id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    post.likes++
    await post.save();

    res.json({ message: "Post like ", likes: post.likes })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });

  }
})


app.post('/postUnLike/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await postModel.findById(id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes > 0) {
      post.likes--
      await post.save();

    }

    res.json({ message: "Post like ", likes: post.likes })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve all post data' });

  }
})

//server
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
})



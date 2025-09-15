const express = require('express');
require('reflect-metadata');
const sharp = require('sharp');
const { createCanvas } = require('canvas');
const { validate, IsEmail, IsString, Length } = require('class-validator');
class UserInput {
  constructor(email, name) {
    this.email = email;
    this.name = name;
  }

  @IsEmail()
  email;

  @IsString()
  @Length(2, 20)
  name;
}

app.use(express.json());

app.post('/validate', async (req, res) => {
  const { email, name } = req.body;
  const input = new UserInput(email, name);
  const errors = await validate(input);
  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    res.json({ message: 'Validation passed!', data: { email, name } });
  }
});


const app = express();
const port = process.env.PORT || 8123;

app.get('/canvas', (req, res) => {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 80, 80);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(10, 10, 80, 80);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Canvas!', 15, 55);
  const buffer = canvas.toBuffer('image/png');
  res.type('png').send(buffer);
});

app.get('/sharp', async (req, res) => {
  // Create a simple 1x1 PNG buffer
  const imageBuffer = await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 }
    }
  })
    .png()
    .toBuffer();

  // Get metadata from the buffer
  const metadata = await sharp(imageBuffer).metadata();
  res.json({ metadata });
});

app.get('/', (req, res) => {
  res.send('Express server with sharp native addon!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

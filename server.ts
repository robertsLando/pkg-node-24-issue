import 'reflect-metadata';
import express, { Request, Response } from 'express';
import sharp from 'sharp';
import { createCanvas } from 'canvas';
import { validate, IsEmail, IsString, Length } from 'class-validator';

class UserInput {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(2, 20)
  name!: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}

const app = express();
const port = process.env.PORT || 8123;

app.use(express.json());

app.post('/validate', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const input = new UserInput(email, name);
  const errors = await validate(input);
  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    res.json({ message: 'Validation passed!', data: { email, name } });
  }
});

app.get('/canvas', (req: Request, res: Response) => {
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

app.get('/sharp', async (req: Request, res: Response) => {
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

app.get('/', (req: Request, res: Response) => {
  res.send('Express server with sharp native addon!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

# Excuses 🤦‍♂️ - AI Professional Excuse Generator

A web application that uses AI to generate professional excuses for workplace situations. Built with Node.js, Express, and OpenAI's GPT-3.5-turbo model.

## Features

- 🤖 AI-powered excuse generation using OpenAI
- 🎨 Beautiful, responsive UI matching the original design
- 📋 One-click copy to clipboard functionality
- 🚀 Ready for deployment on Render.com (free tier)
- 📱 Mobile-responsive design

## Prerequisites

- Node.js (version 16 or higher)
- OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

## Local Development Setup

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env`
   - Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## Deployment on Render.com (Free)

### Step 1: Prepare Your Code
1. Make sure all files are committed to a Git repository (GitHub, GitLab, etc.)
2. Ensure your `package.json` has the correct start script: `"start": "node server.js"`

### Step 2: Deploy on Render
1. Go to [Render.com](https://render.com) and create a free account
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name:** `excuses-app` (or any name you prefer)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 3: Add Environment Variables
1. In your Render dashboard, go to your service
2. Click on "Environment" tab
3. Add the following environment variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at the provided URL

## API Endpoints

- `POST /api/generate-excuse` - Generate an excuse
  - Body: `{ "problem": "your problem description" }`
  - Response: `{ "excuse": "generated excuse text" }`

- `GET /health` - Health check endpoint
  - Response: `{ "status": "OK", "message": "Excuses app is running!" }`

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── public/               # Static files
│   ├── index.html        # Main HTML file
│   ├── styles.css        # CSS styles
│   └── script.js         # Frontend JavaScript
└── README.md             # This file
```

## Customization

### Changing the AI Model
In `server.js`, you can change the model from `gpt-3.5-turbo` to other OpenAI models:
```javascript
model: "gpt-4" // or "gpt-3.5-turbo-16k"
```

### Modifying the Prompt
Edit the prompt in `server.js` to change how excuses are generated:
```javascript
const prompt = `Your custom prompt here: ${problem}`;
```

### Styling
Modify `public/styles.css` to change colors, fonts, and layout.

## Troubleshooting

### Common Issues

1. **"Failed to generate excuse" error:**
   - Check your OpenAI API key is correct
   - Ensure you have credits in your OpenAI account
   - Verify the API key has the correct permissions

2. **App won't start on Render:**
   - Check the build logs in Render dashboard
   - Ensure `package.json` has the correct start script
   - Verify all environment variables are set

3. **Copy to clipboard not working:**
   - This feature requires HTTPS in production
   - Works fine in local development

## Cost Considerations

- **Render.com:** Free tier includes 750 hours/month (enough for personal use)
- **OpenAI API:** Very cheap (~$0.002 per request for GPT-3.5-turbo)
- **Total cost:** Usually under $1/month for moderate usage

## License

This project is open source and available under the MIT License.

---

Built with ❤️ for generating excuses when you need them most! 
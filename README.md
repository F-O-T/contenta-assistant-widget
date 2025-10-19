# Contenta Assistant Widget

A React component library for integrating AI-powered chat widgets into your web applications. Built with TypeScript, Tailwind CSS, and modern React patterns.

## Features

- 🤖 AI-powered chat interface
- 📱 Responsive design with mobile support
- 🎨 Customizable styling with Tailwind CSS
- 🔧 TypeScript support for full type safety
- 📦 Easy installation and integration
- 🚀 Lightweight and performant
- 🌙 Dark/light theme support

## Installation

```bash
npm install contenta-assistant-widget
```

or

```bash
yarn add contenta-assistant-widget
```

or

```bash
pnpm add contenta-assistant-widget
```

## Setup

### 1. Get Contenta API Credentials

1. Sign up at [Contenta.ai](https://contenta.ai)
2. Create a new agent
3. Copy your API key and agent ID

### 2. Environment Variables

Create a `.env` file in your project root:

```env
VITE_CONTENTAGEN_API_KEY=your_api_key_here
VITE_CONTENTAGEN_AGENT_ID=your_agent_id_here
```

Or copy the provided example:

```bash
cp .env.example .env
```

## Usage

### Basic Chat Component

```tsx
import { ContentaChat } from 'contenta-assistant-widget';

function App() {
  return (
    <ContentaChat
      apiKey={import.meta.env.VITE_CONTENTAGEN_API_KEY}
      agentId={import.meta.env.VITE_CONTENTAGEN_AGENT_ID}
    />
  );
}
```

### Widget with Popover

```tsx
import { ContentaWidget } from 'contenta-assistant-widget';

function App() {
  return (
    <ContentaWidget
      apiKey={import.meta.env.VITE_CONTENTAGEN_API_KEY}
      agentId={import.meta.env.VITE_CONTENTAGEN_AGENT_ID}
      position="bottom-right"
      theme="light"
    />
  );
}
```

## API Reference

### ContentaChat Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your Contenta API key |
| `agentId` | `string` | Yes | Your Contenta agent ID |
| `theme` | `'light' \| 'dark'` | No | Theme mode (default: `'light'`) |
| `className` | `string` | No | Additional CSS classes |
| `placeholder` | `string` | No | Input placeholder text |

### ContentaWidget Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your Contenta API key |
| `agentId` | `string` | Yes | Your Contenta agent ID |
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | No | Widget position (default: `'bottom-right'`) |
| `theme` | `'light' \| 'dark'` | No | Theme mode (default: `'light'`) |
| `className` | `string` | No | Additional CSS classes |

## Styling

The widget uses Tailwind CSS for styling. You can customize the appearance by:

1. **Importing the default styles:**
```tsx
import 'contenta-assistant-widget/styles';
```

2. **Using custom CSS:**
```css
.contenta-widget {
  --primary-color: #your-brand-color;
  --background-color: #your-bg-color;
}
```

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/contenta-assistant-widget.git
cd contenta-assistant-widget

# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build:lib
```

### Project Structure

```
src/
├── components/
│   ├── assistant-chat.tsx      # Main chat component
│   ├── assistant-chat-widget.tsx # Widget with popover
│   └── ui/                     # UI components
├── lib/
│   └── utils.ts                # Utility functions
└── index.ts                    # Library exports
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-username/contenta-assistant-widget/wiki)
- 🐛 [Issue Tracker](https://github.com/your-username/contenta-assistant-widget/issues)
- 💬 [Discussions](https://github.com/your-username/contenta-assistant-widget/discussions)

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Contenta AI](https://contenta.ai)

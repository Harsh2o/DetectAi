# Contributing to DetectAi

Thank you for your interest in contributing to DetectAi! We welcome contributions of all kinds — from bug reports and documentation improvements to new detection engines and frontend features.

## 🚀 Getting Started

1. **Fork** this repository.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/detectai.git
   cd detectai
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

## 🏗️ Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Configure your environment variables
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your environment variables
npm run dev
```

## 📐 Code Standards

- **Python**: Follow PEP 8. Use type hints where possible.
- **JavaScript/React**: Use functional components with hooks. Follow ESLint rules.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).

## 🧪 Testing

Before submitting a PR, make sure:
- [ ] The backend starts without errors (`uvicorn main:app`)
- [ ] The frontend builds successfully (`npm run build`)
- [ ] Your changes don't break existing functionality

## 🔀 Pull Request Process

1. Update documentation if your change affects the public API.
2. Ensure your branch is up to date with `main`.
3. Fill out the PR template with a clear description of your changes.
4. Request a review from a maintainer.

## 📝 Reporting Bugs

Open an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected vs. actual behavior
- Screenshots if applicable

## 💡 Suggesting Features

Open an issue tagged `enhancement` with:
- A description of the feature
- Why it would be useful
- Any implementation ideas

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

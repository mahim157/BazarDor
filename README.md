
# 🛒 বাজার দর | BazarDor

### Daily Market Price Tracking Platform

BazarDor is a responsive web application that helps users explore
daily market prices of essential products in Bangladesh. Users can
browse product categories, compare prices, track price changes,
and view market-wise pricing information through a clean and
user-friendly interface.

---

## ✨ Key Features

### 1. 📊 Daily Market Price Tracking
- View current prices of essential products.
- Track price increases and decreases.
- Explore daily price trends using visual indicators.

### 2. 🛍️ Product Categories and Search Experience
- Browse products by category, including rice, lentils, oil,
  vegetables, fish, meat, eggs, milk, and spices.
- View products in a responsive card-based layout.
- Sort products by price from low to high or high to low.

### 3. 📈 Product Details and Market Comparison
- View individual product details.
- Compare minimum, maximum, and average prices.
- Explore market-wise pricing information.

### 4. 🔐 Secure Authentication
- Register and sign in using email and password.
- Sign in with Google and GitHub.
- Manage user sessions and access protected pages using Better Auth.

### 5. 👤 User Profile and Responsive Design
- View profile information.
- Update account name.
- Enjoy a responsive interface on mobile, tablet, and desktop devices.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Building interactive user interfaces |
| TypeScript | Type safety and maintainable code |
| Tailwind CSS | Responsive styling and UI design |
| Better Auth | Authentication and session management |
| MongoDB | Database for authentication data, if configured |
| Sonner | Toast notifications |
| Lucide React | Icons |
| Vercel | Deployment and hosting |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mahim157/BazarDor.git
```

### 2. Navigate to the Project

```bash
cd BazarDor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the environment variables required by your application:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

Configure Google and GitHub OAuth credentials if you use social login.
Use the exact environment variable names expected by your auth
configuration. Never commit real credentials or secrets to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
in your browser.

---

## 🌐 Deployment

The application can be deployed on Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Test authentication, product pages, and page refreshes
   on the deployed website.

---

## 📁 Project Structure

```text
BazarDor/
├── app/
│   ├── category/
│   ├── product/
│   ├── profile/
│   ├── signin/
│   ├── signup/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── public/
├── .env.local
├── package.json
└── README.md
```

---

## 🎯 Project Goal

The goal of BazarDor is to make daily market price information
easier to explore and compare through an accessible, responsive,
and user-friendly web application.

---

## 👨‍💻 Developer

**Moynol Mahim**

- GitHub: [mahim157](https://github.com/mahim157)
- LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/md-moynol-islam-mahim-0a9131336)

---

*BazarDor — প্রতিদিনের বাজারের দাম এক নজরে।*

# Salveena — Premium Polo Collection Landing Page

Self-contained HTML / Tailwind CSS / vanilla JS landing page. No build step —
open `index.html` directly, or upload the whole folder to any static host
(or your existing web hosting via FTP/cPanel).

## ফাইল স্ট্রাকচার

```
index.html          → মূল পেজ (Hero, Reels, 11 Products, Checkout)
admin.html           → লোকাল অর্ডার ব্যাকআপ ভিউয়ার / CSV এক্সপোর্ট
css/style.css        → কালার, ফন্ট, কাস্টম ডিজাইন
js/app.js            → কার্ট, ৩৬% ছাড় লজিক, bKash ফর্ম টগল, সাবমিশন
images/               → ১১টি পলো প্রোডাক্ট ইমেজ (polo-01.svg ... polo-11.svg) + bkash-qr.png
video/                → রিলস ভিডিও রাখার জায়গা (README.txt দেখুন)
apps-script/          → Google Sheet-এর সাথে কানেক্ট করার কোড ও গাইড
```

## যা এখনই পরিবর্তন করা দরকার

1. **প্রোডাক্ট ছবি** — `images/polo-01.svg` থেকে `polo-11.svg` পর্যন্ত এখন
   placeholder illustration (একই ডিজাইন, ভিন্ন কালার)। আসল প্রোডাক্ট ফটো হাতে
   এলে একই ফাইলনেম দিয়ে JPG/PNG দিয়ে রিপ্লেস করুন, অথবা `index.html`-এ
   প্রতিটি `<img src="images/polo-XX.svg">` লাইন এডিট করুন।

2. **দাম** — প্রতিটি প্রোডাক্ট কার্ডে `data-price="990"` — এই সংখ্যাটা বদলালেই
   কার্ট/ডিসকাউন্ট হিসাব অটো আপডেট হয়ে যাবে।

3. **bKash নম্বর / QR** — আপলোড করা QR ছবি থেকে নম্বরটা বসানো আছে
   (`01611-884141`)। নিজের bKash merchant/personal নম্বর হলে
   `images/bkash-qr.png` রিপ্লেস করুন এবং `index.html`-এ নম্বরের টেক্সটও বদলে দিন।

4. **রিলস ভিডিও** — `video/README.txt` দেখুন। ফাইল বসালেই অটো দেখাবে।

5. **Google Sheet-এ অর্ডার জমা** — ডিফল্টভাবে অর্ডারগুলো শুধু ওই ব্রাউজারের
   localStorage-এ সেভ হয় (admin.html দিয়ে দেখা যাবে)। সব ডিভাইস থেকে একটা
   কেন্দ্রীয় Sheet-এ (Excel-এর মতো) জমা করতে হলে `apps-script/SETUP.md`
   অনুসরণ করে ৫ মিনিটে ফ্রি সেটআপ করে নিন।

6. **কন্টাক্ট নম্বর / সোশ্যাল লিংক** — হেডার ও ফুটারে `01312-660033` এবং
   হ্যাশট্যাগগুলো বসানো আছে; নিজেরটা দিয়ে বদলে দিন।

## ৩৬% ছাড়ের লজিক

`js/app.js`-এর একদম উপরে:

```js
const DISCOUNT_THRESHOLD_QTY = 3;   // কয়টা আইটেম হলে ছাড় শুরু হবে
const DISCOUNT_RATE = 0.36;         // কত শতাংশ ছাড়
```

মোট কোয়ান্টিটি (যেকোনো কালার মিলিয়ে) ৩ বা তার বেশি হলেই সাবটোটালে ৩৬%
ছাড় অটোমেটিক এপ্লাই হয় — কার্টে এবং চেকআউট সামারিতে সাথে সাথে দেখা যায়।

## ডেলিভারি চার্জ

`index.html`-এর checkout ফর্মে দুইটা radio option:
- ঢাকার ভিতরে — ৳70
- ঢাকার বাইরে — ৳130

`data-delivery-charge` অ্যাট্রিবিউট বদলে দিলেই চার্জ বদলে যাবে।

## Advanced: রঙ/ফন্ট বদলে CSS রিবিল্ড করা (ঐচ্ছিক)

`css/style.css` আসলে `tailwind.config.js` + `src/input.css`-এর কম্পাইল করা আউটপুট
(CDN-নির্ভর না, তাই লাইভ সাইটে দ্রুত লোড হয়)। শুধু কালার/স্পেসিং বদলাতে চাইলে
`css/style.css`-এ সরাসরি এডিট করাই যথেষ্ট — এর জন্য কিছু ইনস্টল করা লাগবে না।

কিন্তু নতুন Tailwind ইউটিলিটি ক্লাস (যেমন নতুন `<div>`-এ নতুন রঙ) `index.html`-এ
যোগ করলে সেটা `css/style.css`-এ দেখতে হলে রিবিল্ড করতে হবে:

```bash
npm install
npm run build:css
```

(Node.js ইনস্টল থাকা লাগবে — লাগে না শুধু কালার/টেক্সট এডিট করার জন্য।)

## Deploy

যেকোনো static hosting-এ পুরো ফোল্ডার আপলোড করলেই চলবে (Netlify, Vercel,
cPanel/FTP, GitHub Pages)। কোনো সার্ভার-সাইড কোড নেই — শুধু Google Sheet
integration-টা optional backend হিসেবে কাজ করে।

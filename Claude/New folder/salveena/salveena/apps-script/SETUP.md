# অর্ডার ডেটা Google Sheet-এ অটো সেভ করার সেটআপ

এই ধাপগুলো ফলো করলে ওয়েবসাইট থেকে প্রতিটি অর্ডার (নাম, ফোন, ঠিকানা, প্রোডাক্ট, টাকার
পরিমাণ, পেমেন্ট মেথড, bKash Transaction ID, Date, Time) সরাসরি একটা Google Sheet-এ
(এক্সেলের মতোই) জমা হবে — সম্পূর্ণ ফ্রি, কোনো সার্ভার লাগবে না।

## ১. নতুন Google Sheet বানান
1. [sheets.google.com](https://sheets.google.com) এ যান, নতুন একটা blank sheet খুলুন।
2. নাম দিন যেমন **"Salveena Orders"**।

## ২. Apps Script যুক্ত করুন
1. Sheet-এর মেনু থেকে **Extensions → Apps Script** এ ক্লিক করুন।
2. যা লেখা আছে সব মুছে ফেলে এই ফোল্ডারের **Code.gs** ফাইলের পুরো কোড কপি-পেস্ট করুন।
3. উপরে **Save** (ডিস্ক আইকন) ক্লিক করুন।

## ৩. Deploy করুন
1. উপরে ডানদিকে **Deploy → New deployment** ক্লিক করুন।
2. Gear আইকনে ক্লিক করে **Web app** সিলেক্ট করুন।
3. সেটিংস দিন:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. **Deploy** ক্লিক করুন। প্রথমবার Google authorization চাইবে — নিজের অ্যাকাউন্ট দিয়ে অনুমতি দিন।
5. একটা **Web app URL** পাবেন (এমন দেখতে: `https://script.google.com/macros/s/XXXXXXXX/exec`)।
   এই URL কপি করুন।

## ৪. ওয়েবসাইটে URL বসান
`js/app.js` ফাইল খুলুন, একদম উপরে এই লাইনটা খুঁজুন:

```js
const GOOGLE_SHEET_WEBHOOK_URL = "";
```

দুই quote এর মাঝে আপনার কপি করা URL বসান:

```js
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Save করুন, ওয়েবসাইট রিফ্রেশ করুন। এখন থেকে প্রতিটি "অর্ডার কনফার্ম করুন" ক্লিকে সেই
অর্ডারটা Sheet-এ নতুন row হিসেবে জমা হবে — Date ও Time সহ।

## টেস্ট করবেন যেভাবে
একটা টেস্ট অর্ডার সাবমিট করুন, তারপর আপনার Google Sheet-এ ফিরে গিয়ে দেখুন নতুন একটা
row যোগ হয়েছে কিনা। প্রথমবার row না দেখা গেলে ১-২ মিনিট wait করে page reload দিন।

## নোট
- URL বসানোর আগ পর্যন্ত অর্ডারগুলো শুধু কাস্টমারের ব্রাউজারে (localStorage) সেভ থাকবে,
  Sheet-এ যাবে না। তাই লাইভ করার আগেই এই সেটআপ শেষ করে নেওয়া ভালো।
- চাইলে `admin.html` পেজ থেকে যেকোনো ব্রাউজারে জমে থাকা অর্ডারগুলো CSV হিসেবে
  ডাউনলোড করা যাবে (ব্যাকআপ হিসেবে)।

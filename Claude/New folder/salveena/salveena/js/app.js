/* =========================================================
   Salveena Premium Fabrics — app.js
   Cart + 36% tiered discount + bKash toggle + order submission + Size Selection
   ========================================================= */

// [DYNAMIC] Paste your Google Apps Script Web App URL here after
// following apps-script/SETUP.md. Leave blank to keep orders in
// this browser only.
const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxvW4SsRlEpZEJD2hN6xtYme_obVuHdxQSQpjMYVFMFmgAPxDVQPvPsvatln4DssYD3pg/exec";

const DISCOUNT_THRESHOLD_QTY = 3; // "3টি একসাথে অর্ডার করলে" trigger
const DISCOUNT_RATE = 0.36;

(function () {
  const cart = {};

  const cartBar = document.getElementById("cart-bar");
  const summaryItemsEl = document.getElementById("summary-items");
  const emptyMsgEl = document.querySelector("[data-empty-msg]");

  /* ---------------- Product cards: qty steppers & sizes ---------------- */
  document.querySelectorAll("[data-product]").forEach((card) => {
    const id = card.dataset.id;
    const name = card.dataset.name;
    const nameBn = card.dataset.nameBn;
    const price = parseFloat(card.dataset.price);

    const qtyEl = card.querySelector("[data-qty-value]");
    const minusBtn = card.querySelector("[data-qty-minus]");
    const plusBtn = card.querySelector("[data-qty-plus]");
    const sizeRadios = card.querySelectorAll(`input[name="size-${id}"]`);

    // Get currently selected size (No default size logic)
    function getSelectedSize() {
      const checkedRadio = card.querySelector(
        `input[name="size-${id}"]:checked`,
      );
      return checkedRadio ? checkedRadio.value : null;
    }

    function updateStepperUI() {
      const size = getSelectedSize();
      if (!size) {
        qtyEl.textContent = "0";
        return;
      }
      const cartKey = `${id}_${size}`;
      const currentQty = cart[cartKey] ? cart[cartKey].qty : 0;
      qtyEl.textContent = currentQty;
    }

    // Add or remove quantity for the currently selected size
    function changeQty(delta) {
      const size = getSelectedSize();

      // If no size is selected, show an alert when pressing +
      if (!size) {
        if (delta > 0) {
          alert("অনুগ্রহ করে আগে সাইজ সিলেক্ট করুন।");
        }
        return;
      }

      const cartKey = `${id}_${size}`;
      const currentQty = cart[cartKey] ? cart[cartKey].qty : 0;

      let newQty = currentQty + delta;
      newQty = Math.max(0, Math.min(20, newQty)); // Limit max 20 per size

      if (newQty > 0) {
        cart[cartKey] = { id, name, nameBn, price, size, qty: newQty };
      } else {
        delete cart[cartKey];
      }

      updateStepperUI();
      render();
    }

    // Event Listeners
    sizeRadios.forEach((radio) =>
      radio.addEventListener("change", updateStepperUI),
    );
    minusBtn.addEventListener("click", () => changeQty(-1));
    plusBtn.addEventListener("click", () => changeQty(1));

    // Initialize UI
    updateStepperUI();
  });

  /* ---------------- Totals + discount ---------------- */
  function computeTotals() {
    const items = Object.values(cart);
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const discountEligible = totalQty >= DISCOUNT_THRESHOLD_QTY;
    const discount = discountEligible
      ? Math.round(subtotal * DISCOUNT_RATE)
      : 0;
    const deliveryCharge = getSelectedDeliveryCharge();
    const total = subtotal - discount + deliveryCharge;

    return {
      items,
      totalQty,
      subtotal,
      discount,
      discountEligible,
      deliveryCharge,
      total,
    };
  }

  function getSelectedDeliveryCharge() {
    const checked = document.querySelector('input[name="zone"]:checked');
    return checked ? parseInt(checked.dataset.deliveryCharge, 10) : 70;
  }

  /* ---------------- Render: cart bar + order summary ---------------- */
  function render() {
    const {
      items,
      totalQty,
      subtotal,
      discount,
      discountEligible,
      deliveryCharge,
      total,
    } = computeTotals();

    // Sticky cart bar
    document.querySelector("[data-cart-count]").textContent = totalQty;
    document.querySelector("[data-cart-total]").textContent = `৳${total}`;
    cartBar.classList.toggle("is-visible", totalQty > 0);

    // Order summary panel
    if (items.length === 0) {
      summaryItemsEl.innerHTML =
        '<p class="text-inksoft/60 text-sm" data-empty-msg>এখনো কোনো প্রোডাক্ট বাছাই করা হয়নি — কালেকশন থেকে বেছে নিন।</p>';
    } else {
      summaryItemsEl.innerHTML = items
        .map(
          (i) => `
        <div class="flex justify-between items-center mb-1">
          <span class="flex items-center gap-1.5 leading-tight">
            ${i.name} 
            <span class="font-utility font-bold text-[10px] text-brassdeep bg-brass/10 border border-brass/20 px-1.5 py-0.5 rounded">${i.size}</span>
            <span class="text-inksoft/60 text-xs ml-1">× ${i.qty}</span>
          </span>
          <span class="font-medium text-sm">৳${i.qty * i.price}</span>
        </div>
      `,
        )
        .join("");
    }

    document.querySelector("[data-summary-subtotal]").textContent =
      `৳${subtotal}`;
    document.querySelector("[data-discount-row]").style.display =
      discountEligible ? "flex" : "none";
    document.querySelector("[data-summary-discount]").textContent =
      `−৳${discount}`;
    document.querySelector("[data-summary-delivery]").textContent =
      `৳${deliveryCharge}`;
    document.querySelector("[data-summary-total]").textContent = `৳${total}`;
  }

  document
    .querySelectorAll('input[name="zone"]')
    .forEach((r) => r.addEventListener("change", render));

  render();

  /* ---------------- bKash panel toggle ---------------- */
  const bkashPanel = document.getElementById("bkash-panel");
  const bkashTrxInput = document.getElementById("bkash-trx");
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isBkash = document.getElementById("pay-bkash").checked;
      bkashPanel.classList.toggle("hidden", !isBkash);
      bkashTrxInput.required = isBkash;
      if (!isBkash) bkashTrxInput.value = "";
    });
  });

  /* ---------------- Reels: tap-to-play/mute, autoplay on view ---------------- */
  document.querySelectorAll("[data-reel]").forEach((screen) => {
    const video = screen.querySelector("[data-reel-video]");
    const toggleBtn = screen.querySelector("[data-reel-toggle]");

    // The error listener that was hiding the video has been removed
    // so the video poster/fallback can display correctly.

    if (!video) return;

    toggleBtn.addEventListener("click", () => {
      if (video.muted) {
        document.querySelectorAll("[data-reel-video]").forEach((v) => {
          v.muted = true;
        });
        video.muted = false;
      } else {
        video.muted = true;
      }
      video.play().catch(() => {});
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.6 },
      );
      io.observe(screen);
    }
  });

  /* ---------------- Order submission ---------------- */
  const form = document.getElementById("order-form");
  const errorEl = document.getElementById("form-error");
  const submitLabel = document.getElementById("submit-label");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3600);
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  function clearError() {
    errorEl.classList.add("hidden");
  }

  function saveOrderLocally(order) {
    try {
      const existing = JSON.parse(
        localStorage.getItem("salveena_orders") || "[]",
      );
      existing.push(order);
      localStorage.setItem("salveena_orders", JSON.stringify(existing));
    } catch (e) {
      console.warn("Local order backup failed:", e);
    }
  }

  async function sendToSheet(order) {
    if (!GOOGLE_SHEET_WEBHOOK_URL) return;
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(order),
      });
    } catch (e) {
      console.warn("Sheet sync failed, order is still saved locally:", e);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const { items, totalQty, subtotal, discount, deliveryCharge, total } =
      computeTotals();

    if (items.length === 0) {
      showError("অনুগ্রহ করে কমপক্ষে একটি প্রোডাক্ট বাছাই করুন।");
      document
        .getElementById("collection")
        .scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const paymentMethod = document.querySelector(
      'input[name="payment"]:checked',
    ).value;
    const zone = document.querySelector('input[name="zone"]:checked').value;
    const trxId = document.getElementById("bkash-trx").value.trim();

    if (paymentMethod === "bkash" && !trxId) {
      showError("bKash পেমেন্টের জন্য Transaction ID আবশ্যক।");
      return;
    }

    const now = new Date();

    // Create order payload (Including sizes in the items string)
    const order = {
      orderId: "SLV" + now.getTime().toString().slice(-8),
      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString("en-GB"),
      name: document.getElementById("cust-name").value.trim(),
      phone: document.getElementById("cust-phone").value.trim(),
      address: document.getElementById("cust-address").value.trim(),
      zone: zone === "dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে",
      items: items
        .map((i) => `${i.name} [Size: ${i.size}] x${i.qty}`)
        .join(", "),
      itemCount: totalQty,
      subtotal,
      discount,
      deliveryCharge,
      total,
      paymentMethod: paymentMethod === "bkash" ? "bKash" : "Cash on Delivery",
      trxId: paymentMethod === "bkash" ? trxId : "",
      note: document.getElementById("cust-note").value.trim(),
    };

    submitLabel.textContent = "প্রসেস হচ্ছে...";

    saveOrderLocally(order);
    await sendToSheet(order);

    submitLabel.textContent = "অর্ডার কনফার্ম করুন";
    showToast(`ধন্যবাদ ${order.name}! অর্ডার #${order.orderId} সফল হয়েছে।`);

    // Complete Reset
    Object.keys(cart).forEach((k) => delete cart[k]);
    document
      .querySelectorAll("[data-qty-value]")
      .forEach((el) => (el.textContent = "0"));

    // Uncheck all size radio buttons
    document
      .querySelectorAll('input[type="radio"][name^="size-"]')
      .forEach((radio) => {
        radio.checked = false;
      });

    form.reset();
    bkashPanel.classList.add("hidden");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

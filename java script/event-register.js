const BASE_URL = window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : ``;

const PAY_NUMBERS = {
  bkash: '01XXXXXXXXX',
  nagad: '01XXXXXXXXX',
  rocket: '01XXXXXXXXX'
};

let currentEvent = null;

function loadEventInfo() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  currentEvent = {
    _id: eventId || 'unknown',
    title: params.get('title') || 'Event',
    date: params.get('date') || '',
    location: params.get('location') || 'BAUET Campus',
    fee: params.get('fee') || '150'
  };

  document.getElementById('regEventTitle').textContent = currentEvent.title;
  document.getElementById('regFeeAmount').textContent = currentEvent.fee;
  document.getElementById('regEventLocation').textContent = currentEvent.location;

  const d = new Date(currentEvent.date);
  document.getElementById('regEventDate').textContent =
    isNaN(d) ? '—' : d.toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' });
}


function selectPay(label, method) {
  document.querySelectorAll('.pay-option').forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  label.querySelector('input').checked = true;

  const mobileDiv = document.getElementById('mobilePayDetails');
  const cashDiv = document.getElementById('cashDetails');

  if (method === 'cash') {
    mobileDiv.style.display = 'none';
    cashDiv.style.display = 'block';
  } else {
    cashDiv.style.display = 'none';
    mobileDiv.style.display = 'block';
    document.getElementById('payMethodTitle').textContent =
      method.charAt(0).toUpperCase() + method.slice(1) + ' Payment';
    document.getElementById('payNumber').textContent = PAY_NUMBERS[method];
  }
}

function validate() {
  const fields = [
    'regName', 'regStudentId', 'regEmail', 'regPhone', 'regDept', 'regBatch'
  ];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  const emailEl = document.getElementById('regEmail');
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error');
    showToast('Enter a valid email address.', 'error');
    valid = false;
  }

  const method = document.querySelector('input[name="payMethod"]:checked');
  if (!method) {
    showToast('Please select a payment method.', 'error');
    return false;
  }


  if (method.value !== 'cash') {
    const txn = document.getElementById('regTxnId');
    if (!txn.value.trim()) {
      txn.classList.add('error');
      showToast('Please enter the transaction ID.', 'error');
      valid = false;
    } else {
      txn.classList.remove('error');
    }
  }

  if (!valid) showToast('Please fill in all required fields.', 'error');
  return valid;
}


async function submitRegistration() {
  if (!validate()) return;

  const method = document.querySelector('input[name="payMethod"]:checked').value;
  const btn = document.querySelector('.reg-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

  const regData = {
    refId: 'REG-' + Date.now(),
    eventId: currentEvent._id,
    eventTitle: currentEvent.title,
    name: document.getElementById('regName').value.trim(),
    studentId: document.getElementById('regStudentId').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    phone: document.getElementById('regPhone').value.trim(),
    department: document.getElementById('regDept').value,
    batch: document.getElementById('regBatch').value,
    reason: document.getElementById('regReason').value.trim(),
    payMethod: method,
    txnId: method !== 'cash'
      ? document.getElementById('regTxnId').value.trim()
      : 'Cash Payment',
    fee: currentEvent.fee,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  let savedToBackend = false;
  try {
    const res = await fetch(`${BASE_URL}/api/event-registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regData)
    });
    if (res.ok) savedToBackend = true;
  } catch (_) { /* backend is off*/ }


  if (!savedToBackend) {
    const existing = JSON.parse(localStorage.getItem('bauet_registrations') || '[]');
    existing.push(regData);
    localStorage.setItem('bauet_registrations', JSON.stringify(existing));
  }


  document.getElementById('successEventName').textContent = regData.eventTitle;
  document.getElementById('successRef').textContent = regData.refId;
  document.getElementById('successOverlay').style.display = 'flex';

  btn.disabled = false;
  btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Registration';
}


function showToast(msg, type = 'info') {
  let t = document.getElementById('regToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'regToast';
    t.style.cssText = `position:fixed;bottom:24px;right:20px;padding:12px 18px;
      border-radius:10px;font-size:13px;font-weight:500;color:#fff;z-index:9999;
      box-shadow:0 4px 18px rgba(0,0,0,0.2);transition:opacity 0.3s;max-width:280px;`;
    document.body.appendChild(t);
  }
  t.style.background = type === 'error' ? '#e74c3c' : '#2B2E83';
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
  loadEventInfo();
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
});

// ═══════════════════════════════════════════════════
//  event-register.js — Event Registration Form Logic
// ═══════════════════════════════════════════════════

const BASE_URL = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

// Payment numbers per method
const PAY_NUMBERS = {
  bkash:  '01XXXXXXXXX',
  nagad:  '01XXXXXXXXX',
  rocket: '01XXXXXXXXX'
};

let currentEvent = null;

// ── Load event info from URL param ──────────────────
function loadEventInfo() {
  const params  = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  if (!eventId) {
    document.getElementById('regEventTitle').textContent = 'Unknown Event';
    return;
  }

  // Try to get from localStorage cache (set by events.js)
  const cached = localStorage.getItem('bauet_all_events');
  if (cached) {
    const events = JSON.parse(cached);
    currentEvent = events.find(e => String(e._id) === String(eventId));
  }

  // Also try URL params as fallback (events.js passes them)
  if (!currentEvent) {
    currentEvent = {
      _id:      eventId,
      title:    params.get('title')    || 'Event',
      date:     params.get('date')     || '',
      location: params.get('location') || 'BAUET Campus',
      fee:      params.get('fee')      || '150'
    };
  }

  if (currentEvent) {
    document.getElementById('regEventTitle').textContent = currentEvent.title;
    document.getElementById('regFeeAmount').textContent  = currentEvent.fee || '150';

    const d = new Date(currentEvent.date);
    document.getElementById('regEventDate').textContent =
      isNaN(d) ? '—' : d.toLocaleDateString('en-BD', { day:'numeric', month:'long', year:'numeric' });

    document.getElementById('regEventLocation').textContent =
      currentEvent.location || 'BAUET Campus';
  }
}

// ── Payment method selection ─────────────────────────
function selectPay(label, method) {
  // Remove selected from all
  document.querySelectorAll('.pay-option').forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  label.querySelector('input').checked = true;

  const mobileDiv = document.getElementById('mobilePayDetails');
  const cashDiv   = document.getElementById('cashDetails');

  if (method === 'cash') {
    mobileDiv.style.display = 'none';
    cashDiv.style.display   = 'block';
  } else {
    cashDiv.style.display   = 'none';
    mobileDiv.style.display = 'block';
    document.getElementById('payMethodTitle').textContent =
      method.charAt(0).toUpperCase() + method.slice(1) + ' Payment';
    document.getElementById('payNumber').textContent = PAY_NUMBERS[method];
  }
}

// ── Validation ───────────────────────────────────────
function validate() {
  const fields = [
    { id: 'regName',      label: 'Full Name' },
    { id: 'regStudentId', label: 'Student ID' },
    { id: 'regEmail',     label: 'Email' },
    { id: 'regPhone',     label: 'Phone' },
    { id: 'regDept',      label: 'Department' },
    { id: 'regBatch',     label: 'Batch' },
  ];

  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  const method = document.querySelector('input[name="payMethod"]:checked');
  if (!method) {
    showToast('Please select a payment method.', 'error');
    valid = false;
  }

  if (method && method.value !== 'cash') {
    const txn = document.getElementById('regTxnId');
    if (!txn.value.trim()) {
      txn.classList.add('error');
      showToast('Please enter the Transaction ID.', 'error');
      valid = false;
    } else {
      txn.classList.remove('error');
    }
  }

  // Email format
  const emailEl = document.getElementById('regEmail');
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error');
    showToast('Please enter a valid email address.', 'error');
    valid = false;
  }

  return valid;
}

// ── Submit Registration ───────────────────────────────
async function submitRegistration() {
  if (!validate()) return;

  const method = document.querySelector('input[name="payMethod"]:checked').value;
  const btn = document.querySelector('.reg-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

  const regData = {
    id:          'REG-' + Date.now(),
    eventId:     currentEvent?._id || '—',
    eventTitle:  currentEvent?.title || document.getElementById('regEventTitle').textContent,
    name:        document.getElementById('regName').value.trim(),
    studentId:   document.getElementById('regStudentId').value.trim(),
    email:       document.getElementById('regEmail').value.trim(),
    phone:       document.getElementById('regPhone').value.trim(),
    department:  document.getElementById('regDept').value,
    batch:       document.getElementById('regBatch').value,
    reason:      document.getElementById('regReason').value.trim(),
    payMethod:   method,
    txnId:       method !== 'cash' ? document.getElementById('regTxnId').value.trim() : 'Cash Payment',
    fee:         document.getElementById('regFeeAmount').textContent,
    status:      'pending',
    submittedAt: new Date().toISOString()
  };

  // ── Try backend first ──
  let saved = false;
  try {
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regData)
    });
    if (res.ok) saved = true;
  } catch (_) { /* backend not running, use localStorage */ }

  // ── Fallback: localStorage ──
  if (!saved) {
    const existing = JSON.parse(localStorage.getItem('bauet_registrations') || '[]');
    existing.push(regData);
    localStorage.setItem('bauet_registrations', JSON.stringify(existing));
  }

  // ── Show success ──
  document.getElementById('successEventName').textContent = regData.eventTitle;
  document.getElementById('successRef').textContent       = regData.id;
  document.getElementById('successOverlay').style.display = 'flex';

  btn.disabled = false;
  btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Registration';
}

// ── Toast helper ─────────────────────────────────────
function showToast(msg, type = 'info') {
  let t = document.getElementById('regToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'regToast';
    t.style.cssText = `position:fixed;bottom:24px;right:20px;padding:13px 20px;border-radius:10px;
      font-size:13px;font-weight:500;color:#fff;z-index:9999;
      box-shadow:0 4px 18px rgba(0,0,0,0.2);transition:opacity 0.3s;max-width:280px`;
    document.body.appendChild(t);
  }
  t.style.background = type === 'error' ? '#e74c3c' : '#2B2E83';
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// Remove error on input
document.addEventListener('DOMContentLoaded', () => {
  loadEventInfo();
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
});

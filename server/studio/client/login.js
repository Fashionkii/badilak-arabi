'use strict';
const form = document.getElementById('loginForm');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.getElementById('loginButton'), message = document.getElementById('loginMessage');
  button.disabled = true; message.textContent = '';
  try {
    const result = await fetch('/admin/studio?action=login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: document.getElementById('username').value.trim(), password: document.getElementById('password').value }) });
    const data = await result.json();
    if (!result.ok) throw new Error(data.message || 'تعذّر تسجيل الدخول.');
    document.getElementById('password').value = '';
    location.assign('/admin/studio');
  } catch (error) { message.textContent = error.message || 'تعذّر الاتصال. حاول مرة أخرى.'; }
  finally { button.disabled = false; }
});

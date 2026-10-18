const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});
document.getElementById('year').textContent = new Date().getFullYear();

const toast = document.querySelector('.toast');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4500);
}
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  const hint = document.getElementById('orderFormHint');
  const submit = document.getElementById('orderSubmit');
  orderForm.addEventListener('submit', async event => {
    event.preventDefault();
    const cfg = window.VEXORA_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || cfg.supabaseUrl.includes('YOUR_')) {
      hint.textContent = 'La réception des commandes n’est pas encore activée. Suivez SETUP.md pour connecter Supabase.';
      showToast('Configuration requise : connectez d’abord la base de données.');
      return;
    }
    submit.disabled = true;
    submit.innerHTML = 'Envoi en cours…';
    const data = new FormData(orderForm);
    const payload = {
      customer_name: String(data.get('name') || '').trim(),
      customer_email: String(data.get('email') || '').trim(),
      whatsapp: String(data.get('whatsapp') || '').trim() || null,
      service: String(data.get('service') || '').trim(),
      budget: String(data.get('budget') || '').trim() || null,
      deadline: String(data.get('deadline') || '').trim() || null,
      message: String(data.get('message') || '').trim(),
      status: 'new'
    };
    try {
      const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      const { error } = await client.from('orders').insert(payload);
      if (error) throw error;
      orderForm.reset();
      hint.textContent = 'Votre demande a bien été envoyée. Merci !';
      showToast('Commande envoyée avec succès.');
    } catch (err) {
      console.error('VEXORA order submission failed:', err);
      hint.textContent = 'Impossible d’envoyer la demande pour le moment. Réessayez plus tard ou contactez-nous.';
      showToast('Erreur lors de l’envoi. Vérifiez la configuration Supabase.');
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Envoyer ma demande <span>→</span>';
    }
  });
}

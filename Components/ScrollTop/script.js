var btnScrollTop = document.getElementById("ScrollTop");

window.onscroll = () => btnScrollTop.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? "block" : "none";

btnScrollTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
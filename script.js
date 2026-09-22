const products=[
{name:"Classic Black T-Shirt",cat:"Men",price:499,icon:"👕"},
{name:"Denim Casual Shirt",cat:"Men",price:899,icon:"👔"},
{name:"Slim Fit Jeans",cat:"Men",price:1199,icon:"👖"},
{name:"Elegant Ladies Kurti",cat:"Women",price:799,icon:"👗"},
{name:"Everyday Top",cat:"Women",price:599,icon:"👚"},
{name:"Kids Casual Set",cat:"Kids",price:699,icon:"🧒"},
{name:"Kids T-Shirt",cat:"Kids",price:399,icon:"👕"},
{name:"Ladies Denim",cat:"Women",price:999,icon:"👖"}];
let cart=JSON.parse(localStorage.getItem("bf_cart")||"[]");
function renderProducts(){const f=document.getElementById("filter").value;const list=products.filter(p=>f==="all"||p.cat===f);document.getElementById("products").innerHTML=list.map((p,i)=>`<article class="card"><div class="pic">${p.icon}</div><div class="cardInfo"><span class="tag">${p.cat}</span><h3>${p.name}</h3><div class="price">₹${p.price}</div><button class="add" onclick="addToCart(${products.indexOf(p)})">Add to Cart</button></div></article>`).join("")}
function addToCart(i){cart.push(products[i]);save();alert(products[i].name+" added to cart");}
function save(){localStorage.setItem("bf_cart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.length}
function openCart(){document.getElementById("cartModal").style.display="flex";document.getElementById("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cartRow"><span>${p.name}</span><span>₹${p.price} <button onclick="removeItem(${i})">×</button></span></div>`).join(""):"<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent=cart.reduce((s,p)=>s+p.price,0)}
function closeCart(){document.getElementById("cartModal").style.display="none"}
function removeItem(i){cart.splice(i,1);save();openCart()}
function checkout(){if(!cart.length)return alert("Your cart is empty.");const total=cart.reduce((s,p)=>s+p.price,0);const items=cart.map(p=>p.name).join(", ");window.open("https://wa.me/916002741197?text="+encodeURIComponent(`Hello Bodoland Fashion, I want to order: ${items}. Total: ₹${total}`),"_blank")}
function toggleMenu(){document.getElementById("navlinks").classList.toggle("show")}
renderProducts();save();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");

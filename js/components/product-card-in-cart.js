export class productCardInCart
{

    renderCardInCart(item)
    {
        const cart_item = document.createElement("div");
        cart_item.className = "cart-item";
        cart_item.dataset.id = item.id;
        
        const a = document.createElement("a");
        a.className = "cart-item-image-link";
        a.href = `./product.html?id=${item.id}`

        const img = document.createElement("img")
        img.className = "cart-item-image";
        img.src = item.img;
        img.alt = item.title;

        a.appendChild(img);

        const cart_item_info = document.createElement("div");
        cart_item_info.className = "cart-item-info";

        const h3 = document.createElement("h3");
        h3.className = "cart-item-title";
        h3.textContent = item.title;

        const cart_item_price = document.createElement("div");
        cart_item_price.className = "cart-item-price";
        cart_item_price.textContent = `${item.price.toLocaleString()} ₽`;

        const quantity_control = document.createElement("div");
        quantity_control.className = "quantity-control";

        const button_minus = document.createElement("button");
        button_minus.className = "minus";
        button_minus.dataset.id = item.id;
        button_minus.textContent = "-";

        const span = document.createElement("span");
        span.className = "quantity-value";
        span.textContent = item.quantity;

        const button_plus = document.createElement("button");
        button_plus.className = "plus";
        button_plus.dataset.id = item.id;
        button_plus.textContent = "+";

        quantity_control.appendChild(button_minus);
        quantity_control.appendChild(span);
        quantity_control.appendChild(button_plus);

        const item_total = document.createElement("div");
        item_total.className = "item-total";

        item_total.innerHTML = `<strong>Итого:</strong>
            ${(item.price * item.quantity).toLocaleString()} ₽`

        const remove_btn = document.createElement("button");
        remove_btn.className = "remove-btn";
        remove_btn.dataset.id = item.id;
        remove_btn.textContent = "🗑 Удалить";

        cart_item_info.appendChild(h3);
        cart_item_info.appendChild(cart_item_price);
        cart_item_info.appendChild(quantity_control);
        cart_item_info.appendChild(item_total);
        cart_item_info.appendChild(remove_btn);

        cart_item.appendChild(a);
        cart_item.appendChild(cart_item_info);

        return cart_item;

    }
}
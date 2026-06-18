export class adminPanel {
    createForm(product)
    {
        const form = document.createElement("form");
        form.id = "edit-product-form";
        form.className = "edit-product-form";

        const edit_title = this.createInputGroup("text", "edit-title", "title", product.title, "Название товара:");

        const edit_description = document.createElement("div");
        edit_description.className = "form-group";

        const edit_description_label = document.createElement("label");
        edit_description_label.htmlFor = "edit-description";
        edit_description_label.textContent = "Описание:";

        const text_area = document.createElement("textarea");
        text_area.id = "edit-description";
        text_area.name = "description";
        text_area.rows = "4";
        text_area.required = true;
        text_area.textContent = product.description;

        edit_description.appendChild(edit_description_label);
        edit_description.appendChild(text_area);

        const genre_platform = document.createElement("div");
        genre_platform.className = "form-row";

        const edit_genre = this.createInputGroup("text","edit-genre","genre",product.genre,"Жанр:");

        const edit_platform = this.createInputGroup("text","edit-platform","platform",product.platform,"Платформа:");

        genre_platform.appendChild(edit_genre);
        genre_platform.appendChild(edit_platform);

        const price_discount = document.createElement("div");
        price_discount.className = "form-row";

        const edit_price = this.createInputGroup("number","edit-price","price",product.price,"Цена (руб.):",null, null, "1");

        const edit_discount = this.createInputGroup("number","edit-discount","discount",product.discount,"Скидка (%):","0", "100", "1");

        price_discount.appendChild(edit_price);
        price_discount.appendChild(edit_discount);

        const date_developer = document.createElement("div");
        date_developer.className = "form-row";

        const edit_releaseDate = this.createInputGroup("text","edit-releaseDate","releaseDate",product.releaseDate,"Дата выхода:");

        const edit_developer = this.createInputGroup("text","edit-developer","developer",product.developer,"Разработчик:");

        date_developer.appendChild(edit_releaseDate);
        date_developer.appendChild(edit_developer);

        const edit_img = this.createInputGroup("text", "edit-img", "img", product.img)

        const form_actions = document.createElement("div");
        form_actions.className = "form-actions";

        const button_save = document.createElement("button");
        button_save.type = "submit";
        button_save.className = "btn btn-primary";
        button_save.textContent = "💾 Сохранить изменения";

        const button_cancel = document.createElement("button");
        button_cancel.type = "button";
        button_cancel.id = "cancel-edit-btn";
        button_cancel.className = "btn btn-secondary";
        button_cancel.textContent = "❌ Отменить";

        form_actions.appendChild(button_save);
        form_actions.appendChild(button_cancel);

        form.appendChild(edit_title);
        form.appendChild(edit_description);
        form.appendChild(genre_platform);
        form.appendChild(price_discount);
        form.appendChild(date_developer);
        form.appendChild(edit_img);
        form.appendChild(form_actions);

        return form;

    }


    createInputGroup(type, id, name, value, labelText, min = null, max = null, step = null)
    {
        const div = document.createElement("div");
        div.className = "form-group";

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;

        const input = document.createElement("input");
        input.id = id;
        input.type = type;
        input.name = name;
        input.value = value;
        input.required = true;

        if (type === "number")
        {
            input.min = min;
            input.max = max;
            input.step = step;
        }
        
        div.appendChild(label);
        div.appendChild(input);

        return div;
    }

}
document.addEventListener("DOMContentLoaded", () => {
  const productBlocks = document.querySelectorAll(".product-block");
  const popup = document.getElementById("product-popup");
  const closeBtn = document.getElementById("popup-close");
  const title = document.getElementById("popup-title");
  const price = document.getElementById("popup-price");
  const desc = document.getElementById("popup-desc");
  const variantsContainer = document.getElementById("popup-variants");
  const variantForm = document.getElementById("variant-form");

  let selectedVariantId = null;
  let selectedProductHandle = null;

  productBlocks.forEach(block => {
    block.addEventListener("click", () => {
      selectedProductHandle = block.dataset.handle;
      fetch(`/products/${selectedProductHandle}.js`)
        .then(res => res.json())
        .then(product => {
          title.textContent = product.title;
          price.textContent = `$${(product.price / 100).toFixed(2)}`;
          desc.textContent = product.description;

          variantsContainer.innerHTML = "";
          product.variants.forEach(variant => {
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "variant";
            input.value = variant.id;
            input.id = `variant-${variant.id}`;
            input.addEventListener("change", () => {
              selectedVariantId = variant.id;
            });

            const label = document.createElement("label");
            label.htmlFor = input.id;
            label.textContent = variant.title;

            variantsContainer.appendChild(input);
            variantsContainer.appendChild(label);
          });

          popup.classList.remove("hidden");
        });
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  variantForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedVariantId) return alert("Please select a variant");

    await fetch("/cart/add.js", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedVariantId, quantity: 1 })
    });

    const variantLabel = document.querySelector(`input[value="${selectedVariantId}"]`).nextSibling.textContent;
    if (variantLabel.includes("Black") && variantLabel.includes("Medium")) {
      const softWinterJacket = allProducts.find(p => p.title === "Soft Winter Jacket");
      if (softWinterJacket) {
        const variantId = softWinterJacket.variants[0].id;
        await fetch("/cart/add.js", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });
      }
    }

    popup.classList.add("hidden");
  });
});
export function createElementH(textContent,type,...classe){
    let h = document.createElement(`h${type}`);
    classe.forEach((element) =>{
        h.classList.add(element);
    });
    h.innerHTML = textContent;
    return h;
}

export function createElementp(textContent,...classe){
    let p = document.createElement("p");
    classe.forEach((element) =>{
        p.classList.add(element);
    })
    p.textContent = textContent;
    return p;
}

export function createButton(textContent,f){
    let button = document.createElement("button");
    button.textContent = textContent;
    button.addEventListener("click",f)
    return button;
}

export function createSpace(size){
    let button = document.createElement("div");
    button.style.height = `${size}px`;
    return button;
}

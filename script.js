class Pet {
    constructor() {
        this.salud = 100;
        this.energia = 100;
        this.hambre = 50;
        this.coins = 230;
        this.careCounter = 0; 
        this.petType = "dog"; 
        this.isSleeping = false;
        this.currentBackground = "space";
        this.unlockedItems = { beach: false, larva: false };
        this.isActing = false;
        this.currentAction = "";
        this.hasWon = false;
        this.actionTimeout = null; 
        this.iniciarCiclos();
    }

    iniciarCiclos() {
        this.mainInterval = setInterval(() => {
            if (this.salud > 0 && !this.hasWon) {
                if (this.isSleeping) {
                    this.energia = Math.min(100, this.energia + 8);
                    if (this.energia >= 100) this.isSleeping = false; 
                }
                let danoTotal = 0;
                if (this.hambre <= 0) danoTotal += 5;
                if (this.energia <= 0) danoTotal += 5; 
                this.salud = Math.max(0, this.salud - danoTotal);
                updateUI();
            } else {
                clearInterval(this.mainInterval);
            }
        }, 2000);
    }

    handleAction(action) {
        if (this.salud <= 0 || this.isActing || this.hasWon) return false;
        if (action === 'toggleSleep') { 
            this.isSleeping = !this.isSleeping; 
            updateUI(); 
            return true; 
        }
        if (this.isSleeping) return false;

        if (action === 'feed') {
            if (this.hambre >= 100) { alert("¡El perro está lleno!"); return false; }
            this.hambre = Math.min(100, this.hambre + 20);
            this.coins += 10;
            this.startAction("eating");
        } else if (action === 'play') {
            if (this.energia < 20) { alert("¡Muy cansado!"); return false; }
            this.energia -= 20;
            this.hambre = Math.max(0, this.hambre - 15);
            this.coins += 20;
            this.startAction("playing");
        } else if (action === 'clean') {
            this.salud = Math.min(100, this.salud + 10);
            this.coins += 5;
            this.startAction("cleaning");
        }

        this.careCounter++;
        if (this.careCounter >= 20) this.hasWon = true;
        return true;
    }

    // EXTRA 4: Control total de animaciones para que NUNCA se traben
    startAction(type) {
        this.isActing = true;
        this.currentAction = type;
        updateUI();
        
        if (this.actionTimeout) clearTimeout(this.actionTimeout);
        
        this.actionTimeout = setTimeout(() => {
            this.isActing = false;
            this.currentAction = "";
            updateUI();
        }, 1200);
    }

    getSprite() {
        if (this.salud <= 0) return "dead_dog.webp";
        if (this.petType === "dog") {
            if (this.isSleeping) return "sleepy_dog.webp";
            if (this.isActing) {
                if (this.currentAction === "eating") return "eating_dog.webp";
                if (this.currentAction === "playing") return "playing_dog.webp";
                if (this.currentAction === "cleaning") return "perro_limpiandose.png";
            }
            return (this.salud < 30) ? "sick_dog.webp" : "idle_dog.webp"; 
        } else {
            if (this.isSleeping) return "larva_sleeping.webp";
            return (this.hambre < 40) ? "larva_2.webp" : "larva_1.webp";
        }
    }
}

let miMascota = new Pet();

function updateUI() {
    document.getElementById('health').innerText = miMascota.salud;
    document.getElementById('energy').innerText = miMascota.energia;
    document.getElementById('hunger').innerText = miMascota.hambre;
    document.getElementById('coins').innerText = miMascota.coins;
    
    // Actualizar imagen con el sprite correcto
    const spriteImg = document.getElementById('pet-sprite');
    spriteImg.src = miMascota.getSprite();
    
    // Aplicar clase de fondo
    const screen = document.getElementById('game-screen');
    screen.className = `bg-${miMascota.currentBackground}`;

    // Botón de playa (Cambio dinámico)
    const btnBeach = document.getElementById('btn-buy-beach');
    if (miMascota.unlockedItems.beach) {
        btnBeach.innerText = (miMascota.currentBackground === 'beach') ? "PONER ESPACIO" : "PONER PLAYA";
        btnBeach.style.backgroundColor = "#f1c40f"; 
    }

    if (miMascota.unlockedItems.larva) {
        document.getElementById('pet-selector').classList.remove('hidden');
        document.getElementById('btn-buy-larva').innerText = "DESBLOQUEADO";
    }

    // Pantallas finales
    if (miMascota.salud <= 0) {
        document.getElementById('death-screen').classList.remove('hidden');
    } else if (miMascota.hasWon) {
        document.getElementById('win-screen').classList.remove('hidden');
    } else {
        document.getElementById('death-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.add('hidden');
    }
}

function handlePurchase(item, precio) {
    if (miMascota.unlockedItems[item]) {
        if (item === 'beach') {
            miMascota.currentBackground = (miMascota.currentBackground === 'beach') ? 'space' : 'beach';
        }
        updateUI();
        return;
    }
    if (miMascota.coins >= precio) {
        miMascota.coins -= precio;
        miMascota.unlockedItems[item] = true;
        if(item === 'beach') miMascota.currentBackground = 'beach';
        updateUI();
    } else {
        alert("¡No tienes suficientes monedas!");
    }
}

function handleAction(a) { if (miMascota.handleAction(a)) updateUI(); }

function changePetType(t) { 
    if (miMascota.actionTimeout) clearTimeout(miMascota.actionTimeout);
    miMascota.isActing = false;
    miMascota.currentAction = "";
    miMascota.petType = t; 
    updateUI(); 
}

function reiniciarJuego() { 
    if (miMascota.actionTimeout) clearTimeout(miMascota.actionTimeout);
    clearInterval(miMascota.mainInterval);
    miMascota = new Pet(); 
    updateUI(); 
}

updateUI();
const express = require('express')
const router = express.Router()
const cors = require('cors')
const api = require('../models/api2')

router.use(cors());
//Getting all
router.get('/', async (req, res) => {
    try {
        const apis= await api.find()
        res.json(apis)
    } catch  (error) {
        res.status(500).json({message: err.message})
    }
})

let armaTypes = {
    "Espada Ligera": ["Espina de Hierro", "Colmillo Lupino", "Deseo Ponzoñoso", "Huso de Cinabrio"],
    "Lanza": ["Baculo de Homa", "Halcon de Jade", "La Captura", "Lanza de favonius"],
    "Catalizador": ["recuerdos del fluir sempiterno", "Oracion perdida a los vientos sagrados", "Carta nautica", "Sinfonia de los merodeadores"],
    "Mandoble": ["Medula de la serpiente marina", "Lapida del lobo", "Espadon Cornirrojo", "Espada del tiempo"],
    "Arco": ["Ultimo acorde", "Arco de favonius", "Prototipo luz de luna", "Arco del sacrificio"]
    
};

//Random Data
router.get('/random/:equipo', async (req, res) => {
    const equipo = req.params.equipo;
    try {
        // Obtener datos aleatorios del equipo especificado
        const randomData = await api.aggregate([
            { $match: { equipo: equipo } }, // Filtrar por el "equipo" 
            { $sample: { size: 4 } }, // Obtener 4 personajes y "armatype" aleatorios del equipo
            { $project: { _id: 0, genshin: 1, arma: 1, armatype: 1, name: 1, elemento:1 } } // Uso de los campos
        ]);

        // Verificar si hay suficientes personajes en el equipo
        if (randomData.length < 4) {
            return res.status(404).json({ message: 'No hay suficientes personajes en el equipo' });
        }

        // Función para seleccionar aleatoriamente el "armatype" compatible con el "arma" del personaje
        const getRandomArmaType = (arma) => {

            return armaTypes[arma][Math.floor(Math.random() * armaTypes[arma].length)];
        };

        // Asignar armatypes aleatorios basados en el arma de cada personaje
        randomData.forEach(personaje => {
            personaje.armatype = getRandomArmaType(personaje.arma);
        })

        // Extraer los "name" y "armtypes de los datos aleatorios obtenidos
        const characters = randomData.map(item => `${item.genshin} (Nombre: ${item.name}, Elemento: ${item.elemento}, Arma: ${item.armatype})`);

        // Hacer el mensaje para unir con una coma
        const message = `Estás usando a ${characters.join(', ')}`

        // Enviar el mensaje como respuesta
        res.json({ message })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

function actualizarArmatypes(nuevoPersonaje) {
    const { arma, armatype } = nuevoPersonaje;
    if (!armaTypes[arma]) {
        armaTypes[arma] = [armatype];
    } else {
        if (!armaTypes[arma].includes(armatype)) {
            armaTypes[arma].push(armatype);
        }
    }
}


//Getting one
router.get('/:id', getGenshin, (req, res) => {
    res.send(req.apig1)
})
//Creating one
router.post('/', async (req, res) => {
    const apii = new api({
        name: req.body.name,
        genshin: req.body.genshin,
        equipo: req.body.equipo,
        arma: req.body.arma,
        armatype: req.body.armatype,
        elemento: req.body.elemento
    })
    try {
        const nuevaapi = await apii.save()
        res.status(201).json(nuevaapi)
        actualizarArmatypes(req.body)
    } catch (error) {
        res.status(400).json({message: error.message})
    }


})
//Updating one
router.patch('/:id', getGenshin, async (req, res) => {
    if(req.body.name != null ){
        req.apig1.name = req.body.name
    }
    if (req.body.genshin != null){
        req.apig1.genshin = req.body.genshin
    }
    try {
        const updatedgenshin = await req.apig1.save()
        res.json(updatedgenshin)
    }catch (error){
        res.status(400).json({message: error.message})
    }
})
//Deleting one
router.delete('/:id', getGenshin, async (req, res) => {
    try{
        await req.apig1.deleteOne()
        res.json({message: 'Genshin borrado'})
    }catch(error){
        res.status(500).json({ message: error.message})
    }
})





async function getGenshin(req, res, next){
    let apii
    try {
        apii = await api.findById(req.params.id)
        if (apii == null){
            return res.status(404).json({message: 'Cannot find genshin'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    
    req.apig1 = apii;
    next()
}



module.exports = router
import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now()
  },
  sintomas: {
    type: String,
    required: true
  },
  dentista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentista'
  }
}, {
  timestamps: true,
})

const Paciente = mongoose.model('Paciente', pacientesSchema)

export default Paciente
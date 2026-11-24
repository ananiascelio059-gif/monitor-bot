const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const URL = process.env.EVOLUTION_URL;
const KEY = process.env.APIKEY;
const INSTANCE = process.env.INSTANCE;

app.get('/', (req,res)=> res.send('Monitor ON ✅'));

app.post('/webhook', async (req,res)=>{
  try{
    const data = req.body;
    const msg = data?.data?.message?.conversation || data?.data?.message?.extendedTextMessage?.text || '';
    const remoteJid = data?.data?.key?.remoteJid || '';
    const fromMe = data?.data?.key?.fromMe;
    console.log('MSG:', msg, 'DE:', remoteJid);
    if(!fromMe && msg && remoteJid){
      let reply = null;
      const lower = msg.toLowerCase();
      if(lower.includes('monitor')) reply = '🟢 Monitor online! Estou te vigiando aqui 👀✅';
      else if(lower === 'oi' || lower === 'ola' || lower === 'olá') reply = 'Oi! Sou o Monitor 🤖 Digita *monitor* pra testar!';
      else if(lower.includes('ajuda')) reply = 'Comandos:\n*monitor* - testar se estou online\n*oi* - falar comigo';
      if(reply){
        await axios.post(`${URL}/message/sendText/${INSTANCE}`, {number: remoteJid.replace('@s.whatsapp.net','').replace('@lid',''), text: reply}, {headers:{apikey: KEY}});
      }
    }
  }catch(e){ console.log('ERRO', e.message) }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log('Rodando na porta '+PORT));

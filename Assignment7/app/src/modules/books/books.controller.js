import { Router } from "express";
import { profile } from "./books.service.js";
const router=Router()

router.get("/" , (req,res,next)=>{
    const result  = profile(req.query.id)
    return res.status(200).json({message:"Profile" , result})
})
export default router 

const BooksService = require('./books.service');

const service = new BooksService();

exports.createBook = (req, res) => {
  service.createBook(req.body)
    .then(result => res.status(201).json({ ok: 1, id: result.insertedId }))
    .catch(err => res.status(400).json({ error: err.message }));
};

exports.createBooksBatch = (req, res) => {
  service.createBooksBatch(req.body)
    .then(result => res.json({ ok: 1, inserted: result.insertedCount }))
    .catch(err => res.status(400).json({ error: err.message }));
};

exports.createLog = (req, res) => {
  service.createLog({ ...req.body, timestamp: new Date() })
    .then(result => res.status(201).json({ ok: 1, logId: result.insertedId }))
    .catch(err => res.status(400).json({ error: err.message }));
};

exports.updateBookYear = (req, res) => {
  const { title } = req.params;
  const { year } = req.body;
  service.updateBookYear(title, year)
    .then(result => res.json({ ok: 1, modified: result.modifiedCount }))
    .catch(err => res.status(404).json({ error: err.message }));
};

exports.getBookByTitle = (req, res) => {
  service.getBookByTitle(req.query.title)
    .then(book => res.json(book ? { book } : { error: 'Not found' }))
    .catch(err => res.status(500).json({ error: err.message }));
};


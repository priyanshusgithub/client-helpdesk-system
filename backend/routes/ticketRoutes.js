const express=require('express');
const router=express.Router();
const{
   createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  addTicketUpdate,
  closeTicket
}
=require('../controllers/ticketController');

const{protect,isAdmin,isClient,isEngineer,isAdminOrEngineer}=require('../middleware/authMiddleware');

router.use(protect);

router.post('/',isClient,createTicket);
router.get('/',isAdminOrEngineer,getAllTickets);
router.get('/my',isClient,getMyTickets);
router.get('/:id',getTicketById);
router.put('/:id/assign',isAdmin,assignTicket);
router.put('/:id/status',isAdminOrEngineer,updateTicketStatus);
router.put('/:id/update',addTicketUpdate);
router.put('/:id/close',isClient,closeTicket);

module.exports=router;
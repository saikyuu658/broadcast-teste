export type Message = {
  uid?: string;               
  message: string;           
  status: 'SCHEDULE' | 'SENDED'; 
  scheduleTime: string;  
  contactUids: string[];    
  conectionUid: string;        
  createdAt: Date;
  userUid: string
}
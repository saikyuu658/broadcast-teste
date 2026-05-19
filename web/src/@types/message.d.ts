export type message = {
  uid: string;               
  message: string;           
  status: 'agendada' | 'enviada'; 
  schedule: string;  
  contactUids: string[];    
  conectionUid: string;        
  createdAt: string;
}
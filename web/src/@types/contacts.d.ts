export type Contact = {
  uid?: string;          
  name: string;        
  phone: string;    
  conectionsUids?: Array<string>;   
  createdAt: Date;
  userUid: string
}
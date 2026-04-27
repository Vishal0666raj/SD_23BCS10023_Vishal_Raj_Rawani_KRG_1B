#include <iostream>
using namespace std;

class banking{
  public:
  int amount=1000;
 
  
  void balance(){
     cout<<"Amount : "<<amount<<endl;
  }
  
  void deposit(int amnt){
     amount+=amnt;
     cout<<"AMOUNT UPDATED."<<endl;
  }
};

class card : public banking{
  public:
  void card_debit(int taken){
    if(amount>=taken){
       amount-=taken;
       cout<<"DONE"<<endl;
    }
    else{
       cout<<"NOT SUFFICIENT BALANCE"<<endl;
    }
  }
  
  void card_credit(int taken){
     if(amount>=taken){
       amount-=taken;
    }
    else{
       cout<<"NOT SUFFICIENT BALANCE"<<endl;
    }
  }
};

int main() 
{  
  
  
  card c;
  c.balance();
  c.deposit(1000);
  c.balance();
  
  c.card_credit(100);
  c.balance();
  c.card_credit(3000);
  
  return 0;
    
}
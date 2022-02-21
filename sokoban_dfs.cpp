#include <bits/stdc++.h>


using namespace std;



vector<string> board;


struct position{
  unsigned int x;
  unsigned int y;
};

void DFS(){



}

position getPosition(string s){
  position nexPos;
  nexPos.x = s[0];
  nexPos.y = s[2];

  return nexPos;
}

int main(){

  string s;
  position personaje;
  vector<string> cajas;
  while(getline(cin, s)){
    if(s[1] != ',') board.push_back(s);
    else{
      personaje.x = (s[0]-'0');
      personaje.y = (s[2]-'0');
    }
  }

  while(cin >> s){
    cajas.push_back(s);
  }


  return 0;
}
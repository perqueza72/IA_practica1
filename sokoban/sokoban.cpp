#include <bits/stdc++.h>

using namespace std;

//Parsea el formato de las posiciones a pares.
//Retorna un par con las coordenadas {x, y} entregadas en toParse;
pair<int, int> parseCoord(string &toParse)
{
  int x, y;
  string number = "";
  bool first = true;
  toParse.push_back(',');

  for (int i = 0; i < toParse.size(); i++)
  {
    if (toParse[i] == ',')
    {
      if (first)
      {
        first = false;
        y = stoi(number);
        number = "";
      }
      else
      {
        x = stoi(number);
        break;
      }
    }
    else
      number.push_back(toParse[i]); //Añade un nuevo caracter al string aux.
  }

  return make_pair(x, y);
}

//Estructura que almacena puntos en coordenadas x,y
struct point
{
  int x, y;

  point() {}

  point(pair<int, int> &par)
  {
    this->x = par.first;
    this->y = par.second;
  }

  void iniPar(pair<int, int> &par)
  {
    this->x = par.first;
    this->y = par.second;
  }
};

//Estructura que almacena los posibles estados del sokoban
struct estado
{
  point personaje;
  vector<point> cajas;
  string directions;

  estado()
  {
    directions = "";
  }

  void addPersonaje(string &toParse)
  {
    pair<int, int> coords = parseCoord(toParse);
    personaje.iniPar(coords);
    return;
  }

  void addBox(string &toParse)
  {
    pair<int, int> coords = parseCoord(toParse);
    point box(coords);
    cajas.push_back(box);
  }

  void print()
  {
    cout << directions << "\n";
  }
};

/**
  Operador < para structs tipo point.
*/
bool operator<(const point &a, const point &b)
{
  if (a.x == b.x)
    return a.y < b.y;
  return a.x < b.x;
}

//Operar == para structs tipo point.
bool operator==(const point &a, const point &b)
{
  if (a.x == b.x and b.y == a.y)
    return true;
  return false;
}

//Operador < para structs tipo estado.
bool operator<(const estado &a, const estado &b)
{
  if (a.personaje == b.personaje)
  {
    const int size = a.cajas.size();

    //Se comparan todas las cajas(points) y se revisa si uno es mayor que otro.
    for (int i = 0; i < size; i++)
    {
      if (a.cajas[i] == b.cajas[i])
        continue;
      return a.cajas[i] < b.cajas[i];
    }
  }
  return a.personaje < b.personaje;
}

enum dirs
{
  up,
  down,
  dleft,
  dright
};

/*
  Actualiza el punto {p} y lo redirecciona hacia la dirección {dir}
*/
void moveOnDir(point &p, const dirs &dir)
{
  if (dir == up)
    p.y = p.y - 1;
  else if (dir == down)
    p.y = p.y + 1;
  else if (dir == dleft)
    p.x = p.x - 1;
  else if (dir == dright)
    p.x = p.x + 1;
}

//Comprueba si el punto {p} se encuentra dentro de la {board}
bool is_onBoard(const point &p, const int &widthBoard, const int &heightBoard)
{
  if (p.x >= 0 && p.y >= 0 && p.y < heightBoard && p.x < widthBoard)
    return true;
  return false;
}

//Comprueba si el punto {p} está en un muro.
bool is_onWall(const point &p, const deque<string> &board)
{
  if (board[p.y][p.x] == 'W')
    return true;
  return false;
}

//Revisa si el personaje {e.personaje} puede moverse en la dirección {dir}
//Retorna {true} si es posible hacer el movimiento, {false} de lo contrario.
bool checkMovement(const deque<string> &board, estado &e, const dirs &dir)
{
  point player = e.personaje; //Posición del personaje.
  moveOnDir(player, dir);     //Cambia su posición

  if (is_onWall(player, board))
    return false; //Si está en un muro es imposible realizar el movimiento.

  //Revisa si la nueva posición del jugador colisiona contra una caja.
  if(binary_search(e.cajas.begin(), e.cajas.end(), player)){ 
    point cajaMoved = player; //Se crea una caja con la posición del jugador si se moviera.
    moveOnDir(cajaMoved, dir); //Se "empuja" la caja

    if (!is_onBoard(cajaMoved, board.size(), board[cajaMoved.y].size()))
        return false; //Si está dentro del Board continua la ejecución, de lo contrario termina este proceso.
      if (is_onWall(cajaMoved, board))
        return false; //Revisa si al mover la caja se encuentra con un muro

    if(binary_search(e.cajas.begin(), e.cajas.end(), cajaMoved)){ //Revisa si al mover la caja se topa con otra nueva caja.
      return false;
    }
  }

  return true;
}

//Guarda la dirección hacia donde se mueve el {estado.personaje}
void addDirection(estado &e, const dirs &dir)
{
  if (dir == up)
    e.directions.push_back('U');
  else if (dir == down)
    e.directions.push_back('D');
  else if (dir == dleft)
    e.directions.push_back('L');
  else if (dir == dright)
    e.directions.push_back('R');
}

//Retorna un nuevo estado {e} al mover el personaje en la dirección {dir}
estado crearHijo(estado e, const dirs &dir)
{
  moveOnDir(e.personaje, dir);
  addDirection(e, dir);

  for (point &caja : e.cajas)
    if (e.personaje == caja)
      moveOnDir(caja, dir);
  return e;
}

//Crea todos los posibles estados resultantes del estado actual {e}.
void crearHijos(const deque<string> &board, estado &e, deque<estado> &estados)
{
  if (checkMovement(board, e, dright))
    estados.push_back(crearHijo(e, dright));
  if (checkMovement(board, e, dleft))
    estados.push_back(crearHijo(e, dleft));
  if (checkMovement(board, e, down))
    estados.push_back(crearHijo(e, down));
  if (checkMovement(board, e, up))
    estados.push_back(crearHijo(e, up));
}

//Revisa si un estado {e} es solución de la {board}
//Si es solución retorna {true}, de lo contrario {false}
bool checkSolution(const deque<string> &board, estado &e)
{
  for (auto caja : e.cajas)
  {
    if (board[caja.y][caja.x] != 'X')
      return false;
  }

  return true;
}

//Funcion que lee el input del problema del Sokoban
void readInput(deque<string> &board, estado &estadoInicial)
{
  string input; //String que almacena la entrada.
  //Lee el board hasta que encuentra la primer coordenada.
  while (getline(cin, input), input.find(",") == -1)
    board.push_back(input);

  //Almacena la coordenada del personaje.
  estadoInicial.addPersonaje(input);

  //Almacena todas las coordenadas de las cajas.
  while (getline(cin, input), input.size() != 0)
    estadoInicial.addBox(input);
}

//Función que intenta resolver el Sokoban usando BFS.
void resolveSokobanBFS(const deque<string> &board, estado estadoActual, int MAX_ITERATIONS = 64)
{

  set<estado> estado_visto; //Almacena los estados vistos
  deque<estado> estados;

  estados.push_back(estadoActual); //Se ingresa el primer estado.
  while (!estados.empty() && estadoActual.directions.size() < MAX_ITERATIONS)
  {
    estadoActual = estados.front();
    estados.pop_front();

    //Revisa si el estado actual ya ha sido visitado. De ser así, deja de revisar el nodo y sus hijos.
    if (estado_visto.count(estadoActual))
      continue;
    estado_visto.insert(estadoActual); //Almacena el nuevo estado visto.

    //Revisa si ya se encontró una solución del tablero.
    if (checkSolution(board, estadoActual))
    {
      estadoActual.print();
      break;
    }

    crearHijos(board, estadoActual, estados);
  }
}

//Función que intenta resolverl el Sokoban usando DFS.
bool resolveSokobanDFS(const deque<string> &board, estado estadoActual, int MAX_ITERATION)
{
  set<estado> estado_visto;
  deque<estado> estados;
  bool solved = false;

  estados.push_back(estadoActual);
  while (!estados.empty())
  {
    estadoActual = estados.back();
    estados.pop_back();

    if (estadoActual.directions.size() >= MAX_ITERATION)
      continue;

    if (estado_visto.count(estadoActual))
      continue;

    estado_visto.insert(estadoActual);

    if (checkSolution(board, estadoActual))
    {
      estadoActual.print();
      solved = true;
      break;
    }

    crearHijos(board, estadoActual, estados);
  }

  return solved;
}

//Función que intenta resolver el Sokoban usando DFS con profundidad iterativa.
void resolveSokobanDFSIterativo(const deque<string> &board, estado estadoActual, int MAX_ITERATION)
{
  bool solved;
  for(int i = 10; i < MAX_ITERATION; i++){
    solved = resolveSokobanDFS(board, estadoActual, i);
    if(solved) break;
  }
}

int main()
{
  deque<string> board; //Tablero de Sokuban.
  estado estadoActual; //Estado actual del juego.
  int MAX_ITERATION = 64;

  readInput(board, estadoActual);
  resolveSokobanBFS(board, estadoActual);
  resolveSokobanDFS(board, estadoActual, MAX_ITERATION);
  resolveSokobanDFSIterativo(board, estadoActual, MAX_ITERATION);

  return 0;
}

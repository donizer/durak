INFINITY = float('inf')

# toes %win # fans
weights = [ [0.1, 0.1, -.3],# hurt?
            [0.1, 0.2, 0.0],# win?
            [0.0, 1.3, 0.1]]# sad?

def w_sum(a,b):
  assert(len(a)==len(b))
  out = 0
  for i in range(len(a)):
    out += a[i]+b[i]
  return out

def vect_mat_mul(vect,matrix):
  # assert(len(vect) == len(matrix))
  output = [0] * len(matrix)

  for i in range(len(vect)):
    output[i] = w_sum(vect,matrix[i])
  return output

def neural_network(input, weights):
  pred = vect_mat_mul(input,weights)
  return pred

def zeros_matrix(a,b):
  return [[0]*b]*a

def outer_prod(vec_a, vec_b):
  out = zeros_matrix(len(vec_a),len(vec_b))
  for i in range(len(vec_a)):
    for j in range(len(vec_b)):
      out[i][j] = vec_a[i]*vec_b[j]
  return out

toes =  [8.5, 9.5, 9.9, 9.0]
wlrec = [0.65,0.8, 0.8, 0.9]
nfans = [1.2, 1.3, 0.5, 1.0]

hurt = [0.1, 0.0, 0.0, 0.1]
win =  [1, 1, 0, 1]
sad =  [0.1, 0.0, 0.1, 0.2]

alpha = 0.01

input = [toes[0],wlrec[0],nfans[0]]
true = [hurt[0], win[0], sad[0]]

error=[INFINITY,INFINITY,INFINITY]

iter = 0
while(error[0]>0.001 or error[1]>0.001 or error[2]>0.001): #error[0]>0.001 or error[1]>0.001 or error[2]>0.001

  if iter >= 5000: break
  
  pred = neural_network(input,weights)

  error = [0, 0, 0]
  delta = [0, 0, 0]

  for i in range(len(true)):
    delta[i] = pred[i] - true[i]
    error[i] = delta[i] ** 2

  weight_deltas = outer_prod(input,delta)

  print("Iteration: " + str(iter+1))
  print("Pred: " + str(pred))
  print("Error: " + str(error))
  # print("Delta: " + str(delta))
  # print("Weights: " + str(weights))
  # print("Weight_Deltas: ")
  # print(str(weight_deltas))
  print()

  for i in range(len(weights)):
      for j in range(len(weights[i])):
        weights[i][j] -= alpha * weight_deltas[i][j]
  iter=iter+1


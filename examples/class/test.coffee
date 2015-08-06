class A
  constructor: () ->
    console.log('a', @ instanceof A, @)

class B extends A
  constructor: () ->
    super()

B()

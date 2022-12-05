const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Building a project',
        exercises: 12,
        id: 4
      }
    ]
  }

  const Course = ({ course }) => {

    const Header = () => {
      return (
        <h1>
          {course.name}
        </h1>
      )
    }

    const Content = () => {

      const info = course.parts

      const Part = () => {
        console.log(course.parts)
        return (
          <ul>
            {info.map(d => (
              <li key={d.id}>{d.name} {d.exercises}</li>
            ))}
          </ul>
        )
      }

      const Total = () => {
        const total = info.reduce(
          (s, p) => s + p.exercises, 0,
        );
        return (
          <div>
            <p>Number of exercises {total}</p>
          </div>
        )
      }

      return (
        <div>
          <Header course={course} />
          <Part course={course} />
          <Total course={course} />
        </div>
      )
    }

    return (
      <Content course={course}/>
    )

  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
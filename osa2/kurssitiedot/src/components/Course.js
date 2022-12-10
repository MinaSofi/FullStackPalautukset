const Course = ({ courses }) => {

    const Header = () => {
      return (
        <div>
          {courses.map((d, index) => {
            return (
              <div key={index}>
                <h2>{d.name}</h2>
              </div>
            )
          })}
        </div>
      );
    }

    const Content = () => {
      console.log(courses)
      const courseParts = courses.map(d => (d.parts))
      console.log(courseParts)

      const Part = () => {
        return (
          <div>
            {courseParts.map(d => 
              (d.map(g => 
                <li key={g.id}>{g.name} {g.exercises}</li>
              )))
            }
          </div>
        )
      }

      const Total = () => {
        const total = courseParts.map(d => 
          (d.reduce(
              (s, p) => s + p.exercises, 0,
            )
          )
        )
        return (
          <div>
            <p>Number of exercises {total}</p>
          </div>
        )
      }

      return (
        <div>
          <Header />
          <Part />
          <Total />
        </div>
      )
    }

    return (
      <div>
        <h1>Curriculum for the semester</h1>
        <Content />
      </div>
    )

}

export default Course
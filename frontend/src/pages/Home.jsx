
function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <span className="home-badge">YOUR FINANCIAL LEARNING COMPANION</span>

        <h1>Welcome to GoalInvest Advisor</h1>

        <h2>Your AI-Powered Personal Finance Assistant</h2>

        <p>
          Understand finance, plan your goals, and learn about
          investments with AI.
        </p>

        <div className="home-buttons">
          <a href="/chat" className="home-button primary-button">
            Ask AI Assistant
          </a>

          <a href="/goal-planner" className="home-button secondary-button">
            Plan Your Goal
          </a>
        </div>
      </section>

      <section className="home-section">
        <h2>How It Works</h2>

        <div className="home-grid">
          <article className="home-card">
            <span className="home-number">01</span>
            <h3>Ask</h3>
            <p>
              Ask questions about SIPs, mutual funds, savings,
              and investments.
            </p>
          </article>

          <article className="home-card">
            <span className="home-number">02</span>
            <h3>Understand</h3>
            <p>
              Get educational explanations supported by relevant
              reference documents.
            </p>
          </article>

          <article className="home-card">
            <span className="home-number">03</span>
            <h3>Plan</h3>
            <p>
              Calculate the estimated monthly savings needed
              to reach your financial goals.
            </p>
          </article>

          <article className="home-card">
            <span className="home-number">04</span>
            <h3>Learn</h3>
            <p>
              Explore financial concepts and understand the
              information behind AI answers.
            </p>
          </article>
        </div>
      </section>

      <section className="home-section home-features">
        <h2>What You Can Do</h2>
        <p>Everything you need to begin learning about personal finance.</p>

        <div className="home-feature-list">
          <span>✓ Ask financial questions</span>
          <span>✓ Calculate financial goals</span>
          <span>✓ Explore reference-based answers</span>
          <span>✓ Understand financial concepts</span>
        </div>
      </section>

      <section className="home-disclaimer">
        <h3>Educational Disclaimer</h3>
        <p>
          GoalInvest Advisor is an educational project. Its information
          is for learning purposes and is not personalized financial advice.
        </p>
      </section>
    </main>
  );
}

export default Home;

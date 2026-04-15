import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { quizQuestions, quizResults, products } from "@/lib/data";
import { useState } from "react";

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-3=questions, 4=result
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    transitionTo(() => {
      setCurrentStep(1);
      setAnswers([]);
    });
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    transitionTo(() => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(4);
      }
    });
  };

  const handleRetake = () => {
    transitionTo(() => {
      setCurrentStep(0);
      setAnswers([]);
    });
  };

  const transitionTo = (callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };

  // Compute result
  const getResult = () => {
    const goalAnswers = [answers[0], answers[1]];
    const counts: Record<string, number> = {};
    goalAnswers.forEach((a) => {
      if (a) counts[a] = (counts[a] || 0) + 1;
    });

    // Most common, or Q1 on tie
    let goal = answers[0];
    let maxCount = 0;
    for (const [key, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        goal = key;
      }
    }

    const format = answers[2];
    const key = `${goal}-${format}`;
    const result = quizResults[key];
    if (!result) return null;

    const product = products.find((p) => p.id === result.productId);
    return { ...result, product };
  };

  const getAlsoLike = () => {
    const result = getResult();
    if (!result?.product) return [];
    return products
      .filter((p) => p.id !== result.product!.id && !p.isBundle)
      .slice(0, 2);
  };

  const progressPercent = currentStep === 0 ? 0 : currentStep > 3 ? 100 : (currentStep / 3) * 100;

  return (
    <Layout>
      <section className="py-20 px-4 min-h-[80vh] flex items-center justify-center">
        <div
          className={`w-full max-w-2xl mx-auto transition-all duration-300 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Intro */}
          {currentStep === 0 && (
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 bg-primary/5 mb-4">
                <span className="text-4xl">🍄</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find Your{" "}
                <span className="text-gradient-gold">Mushroom</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Answer 3 quick questions and we'll match you with your ideal
                mushroom protocol.
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg rounded-xl glow-gold"
              >
                Take the Quiz
              </Button>
              <p className="text-sm text-muted-foreground/60">
                Takes less than 30 seconds
              </p>
            </div>
          )}

          {/* Questions */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="space-y-8">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Question {currentStep} of 3</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-center pt-4">
                {quizQuestions[currentStep - 1].question}
              </h2>

              {/* Options */}
              <div className="grid gap-3 pt-2">
                {quizQuestions[currentStep - 1].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.value)}
                    className="group w-full text-left px-6 py-5 rounded-xl border border-border bg-card
                      hover:border-primary/50 hover:bg-primary/5
                      transition-all duration-300 hover-card-lift cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex-shrink-0 w-9 h-9 rounded-full border border-border
                        group-hover:border-primary group-hover:bg-primary/10
                        flex items-center justify-center text-sm font-medium text-muted-foreground
                        group-hover:text-primary transition-all duration-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-base md:text-lg font-medium group-hover:text-primary transition-colors duration-300">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === 4 && (() => {
            const result = getResult();
            const alsoLike = getAlsoLike();
            if (!result?.product) return null;
            const { product, headline, reason } = result;

            return (
              <div className="space-y-10">
                {/* Result header */}
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-primary uppercase tracking-widest">
                    Your Result
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="text-gradient-gold">{headline}</span>
                  </h2>
                </div>

                {/* Product card */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2 bg-gradient-to-br from-card to-background p-8 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-64 h-64 object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-5">
                      {product.badge && (
                        <span className="inline-block w-fit text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {product.badge}
                        </span>
                      )}
                      <h3 className="text-2xl font-bold">{product.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {reason}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          one-time
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Subscribe & save:{" "}
                        <span className="text-primary font-semibold">
                          ${product.subscriptionPrice.toFixed(2)}/mo
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5 glow-gold">
                            View Product
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={handleRetake}
                          className="rounded-xl py-5 border-border hover:border-primary/50"
                        >
                          Retake Quiz
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Also like */}
                {alsoLike.length > 0 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-center">
                      You might also like
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {alsoLike.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          className="group rounded-xl border border-border bg-card p-5 hover-card-lift transition-all duration-300 hover:border-primary/30"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-20 h-20 object-contain rounded-lg bg-background"
                            />
                            <div className="space-y-1">
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {p.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {p.category}
                              </p>
                              <p className="text-primary font-bold">
                                ${p.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>
    </Layout>
  );
};

export default Quiz;

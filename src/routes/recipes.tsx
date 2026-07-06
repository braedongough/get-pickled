import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import type { BrineRecipe } from '~/data/recipes'
import type { PicklingMethod } from '~/data/pickleGuide'
import { BRINE_RECIPES } from '~/data/recipes'
import { METHOD_LABELS, getGuideEntry } from '~/data/pickleGuide'
import { Reveal } from '~/lib/useReveal'

export const Route = createFileRoute('/recipes')({
  component: Recipes,
})

function Recipes() {
  const { data: customRecipes } = useSuspenseQuery(
    convexQuery(api.recipes.list, {}),
  )
  const [showForm, setShowForm] = React.useState(false)

  const quick = BRINE_RECIPES.filter((recipe) => recipe.method === 'quick')
  const fermented = BRINE_RECIPES.filter(
    (recipe) => recipe.method === 'fermented',
  )

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-36 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-balance max-w-xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink-950">
            Brines & recipes
          </h1>
          <button
            onClick={() => setShowForm((open) => !open)}
            className="ease-lux group flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98]"
          >
            {showForm ? 'Close' : 'Write your own'}
            <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
              {showForm ? '×' : '✎'}
            </span>
          </button>
        </div>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-500">
          Six house brines that cover most of what's worth pickling — plus your
          own. Quick brines assume a standard 1-pint (500 ml) jar, packed
          tight.
        </p>
      </Reveal>

      {showForm && (
        <div className="mt-10">
          <NewRecipeForm onDone={() => setShowForm(false)} />
        </div>
      )}

      {customRecipes.length > 0 && (
        <RecipeSection title="Your recipes">
          {customRecipes.map((recipe, index) => (
            <Reveal key={recipe._id} delay={index * 70}>
              <CustomRecipeCard recipe={recipe} />
            </Reveal>
          ))}
        </RecipeSection>
      )}

      <RecipeSection title="Quick vinegar brines">
        {quick.map((recipe, index) => (
          <Reveal key={recipe.id} delay={index * 70}>
            <BuiltInRecipeCard recipe={recipe} />
          </Reveal>
        ))}
      </RecipeSection>

      <RecipeSection title="Fermentation">
        {fermented.map((recipe, index) => (
          <Reveal key={recipe.id} delay={index * 70}>
            <BuiltInRecipeCard recipe={recipe} />
          </Reveal>
        ))}
      </RecipeSection>
    </main>
  )
}

function RecipeSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-16">
      <Reveal>
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950">
          {title}
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {children}
      </div>
    </section>
  )
}

function RecipeShell({ children }: { children: React.ReactNode }) {
  return (
    <article className="bezel h-full">
      <div className="bezel-core flex h-full flex-col px-7 py-6">
        {children}
      </div>
    </article>
  )
}

function RecipeBody({
  ingredients,
  steps,
}: {
  ingredients: Array<string>
  steps: Array<string>
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">
          Ingredients
        </h4>
        <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-ink-700">
          {ingredients.map((ingredient) => (
            <li key={ingredient} className="flex gap-2">
              <span className="text-pickle-400">·</span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">
          Method
        </h4>
        <ol className="mt-2.5 space-y-2 text-sm leading-relaxed text-ink-700">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-2.5">
              <span className="font-display font-medium tabular-nums text-pickle-600">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function BuiltInRecipeCard({ recipe }: { recipe: BrineRecipe }) {
  return (
    <RecipeShell>
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-pickle-600">
          {METHOD_LABELS[recipe.method]}
        </span>
        <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink-950">
          {recipe.emoji} {recipe.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {recipe.description}
        </p>
      </div>

      <RecipeBody ingredients={recipe.ingredients} steps={recipe.steps} />

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-1.5 border-t border-ink-950/[0.06] pt-4">
          <span className="mr-1 text-[11px] font-semibold text-ink-400">
            Great for
          </span>
          {recipe.goodFor.map((ingredientId) => {
            const entry = getGuideEntry(ingredientId)
            if (!entry) {
              return null
            }
            return (
              <span
                key={ingredientId}
                className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-700"
              >
                {entry.emoji} {entry.name}
              </span>
            )
          })}
        </div>
      </div>
    </RecipeShell>
  )
}

function CustomRecipeCard({ recipe }: { recipe: Doc<'recipes'> }) {
  const remove = useMutation(api.recipes.remove)

  return (
    <RecipeShell>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-pickle-600">
            {METHOD_LABELS[recipe.method]} · yours
          </span>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink-950">
            📓 {recipe.name}
          </h3>
          {recipe.description && (
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              {recipe.description}
            </p>
          )}
        </div>
        <button
          onClick={() => void remove({ id: recipe._id })}
          className="ease-lux shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-800/50 transition-all duration-300 hover:bg-red-50 hover:text-red-800"
        >
          Delete
        </button>
      </div>

      <RecipeBody ingredients={recipe.ingredients} steps={recipe.steps} />
    </RecipeShell>
  )
}

// Strips list markers ("- ", "• ", "1. ", "2) ") but leaves bare quantities
// like "1 cup vinegar" untouched.
function splitLines(value: string): Array<string> {
  return value
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-•]|\d+[.)])\s+/, '').trim())
    .filter((line) => line.length > 0)
}

function NewRecipeForm({ onDone }: { onDone: () => void }) {
  const create = useMutation(api.recipes.create)

  const [name, setName] = React.useState('')
  const [method, setMethod] = React.useState<PicklingMethod>('quick')
  const [description, setDescription] = React.useState('')
  const [ingredients, setIngredients] = React.useState('')
  const [steps, setSteps] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ingredientList = splitLines(ingredients)
    const stepList = splitLines(steps)

    if (!name.trim()) {
      setError('Give your recipe a name.')
      return
    }
    if (ingredientList.length === 0) {
      setError('Add at least one ingredient — brine needs something in it.')
      return
    }
    if (stepList.length === 0) {
      setError('Add at least one step.')
      return
    }

    setError('')
    setSaving(true)
    try {
      await create({
        name: name.trim(),
        method,
        description: description.trim() || undefined,
        ingredients: ingredientList,
        steps: stepList,
      })
      onDone()
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'ease-lux w-full rounded-xl border-0 bg-cream-100 px-3.5 py-2.5 text-sm text-ink-950 ring-1 ring-transparent transition-all duration-300 focus:bg-white focus:ring-pickle-400 outline-none'
  const labelClass =
    'block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400 mb-1.5'

  return (
    <Reveal>
      <div className="bezel">
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="bezel-core px-7 py-7 sm:px-9 sm:py-8"
        >
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950">
            Write your own recipe
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            It'll show up in the brine picker when you start a batch.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="recipeName" className={labelClass}>
                Recipe name
              </label>
              <input
                id="recipeName"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nan's horseradish dills"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="recipeMethod" className={labelClass}>
                Method
              </label>
              <select
                id="recipeMethod"
                value={method}
                onChange={(event) =>
                  setMethod(event.target.value as PicklingMethod)
                }
                className={inputClass}
              >
                <option value="quick">{METHOD_LABELS.quick}</option>
                <option value="fermented">{METHOD_LABELS.fermented}</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="recipeDescription" className={labelClass}>
                Description (optional)
              </label>
              <input
                id="recipeDescription"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Hot, sweet, and dangerous on a burger."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="recipeIngredients" className={labelClass}>
                  Ingredients — one per line
                </label>
                <textarea
                  id="recipeIngredients"
                  value={ingredients}
                  onChange={(event) => setIngredients(event.target.value)}
                  rows={6}
                  placeholder={
                    '1 cup apple cider vinegar\n1 cup water\n1 tbsp kosher salt\n2 sprigs dill'
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="recipeSteps" className={labelClass}>
                  Steps — one per line
                </label>
                <textarea
                  id="recipeSteps"
                  value={steps}
                  onChange={(event) => setSteps(event.target.value)}
                  rows={6}
                  placeholder={
                    'Simmer the brine until salt dissolves\nPack the jar with produce and aromatics\nPour brine over, cool, refrigerate'
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {error}
            </p>
          )}

          <div className="mt-7 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="ease-lux group flex items-center gap-3 rounded-full bg-ink-950 py-2 pl-6 pr-2 text-sm font-semibold text-cream-50 transition-all duration-500 hover:bg-pickle-800 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save recipe'}
              <span className="ease-lux flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5">
                ↗
              </span>
            </button>
            <button
              type="button"
              onClick={onDone}
              className="text-sm font-semibold text-ink-400 transition-colors duration-300 hover:text-ink-950"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Reveal>
  )
}

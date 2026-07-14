import { clonePlan, createDefaultPlan, type FloorPlan } from './homeDesigner'

const STORAGE_KEY = 'coffee-break-floor-plan'

export function loadFloorPlan(): FloorPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultPlan()
    const parsed = JSON.parse(raw) as FloorPlan
    if (!parsed || !Array.isArray(parsed.rooms) || !Array.isArray(parsed.furniture)) {
      return createDefaultPlan()
    }
    return parsed
  } catch {
    return createDefaultPlan()
  }
}

export function saveFloorPlan(plan: FloorPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
}

export function resetFloorPlan(): FloorPlan {
  const plan = createDefaultPlan()
  saveFloorPlan(plan)
  return plan
}

export function exportPlanJson(plan: FloorPlan): void {
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${plan.name || 'floor-plan'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function duplicateForHistory(plan: FloorPlan): FloorPlan {
  return clonePlan(plan)
}

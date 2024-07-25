#pragma once

#include "BombTimer/BombTimerUnloadHandler.h"
#include "DefusingAlert/DefusingAlertUnloadHandler.h"
#include "HudFeaturesStates.h"

template <typename HookContext>
struct HudFeaturesUnloadHandler {
    HudFeaturesUnloadHandler(HookContext& hookContext, HudFeaturesStates& states) noexcept
        : hookContext{hookContext}
        , states{states}
    {
    }

    void handleUnload() const noexcept
    {
        hookContext.template make<BombTimerUnloadHandler>(states.bombTimerState).handleUnload();
        hookContext.template make<DefusingAlertUnloadHandler>(states.defusingAlertState).handleUnload();
    }

private:
    HookContext& hookContext;
    HudFeaturesStates& states;
};

__all__ = [
]

for model_name in __all__:
    model = globals().get(model_name)
    if model and hasattr(model, "model_rebuild"):
        model.model_rebuild()

import { Dispatch, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { categories } from "../data/categories";
import type { Activity } from "../types/index";
import { ActivityActions, ActivityState } from "../reducers/activityReducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: "",
  calories: 0,
};

export const Form = ({ dispatch, state }: FormProps) => {
  const [activity, setActivity] = useState<Activity>(initialState);

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.find(
        (e) => e.id === state.activeId
      );

      if (!selectedActivity) {
        return;
      }

      setActivity(selectedActivity);
      return;
    }
  }, [state.activeId]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id);

    setActivity((prevState) => {
      return {
        ...prevState,
        [e.target.id]: isNumberField ? +e.target.value : e.target.value,
      };
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;

    return name.trim() !== "" && calories > 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: "save-activity", payload: { newActivity: activity } });
    setActivity({ ...initialState, id: uuidv4() });
  };

  return (
    <form
      className="space-y-5 bg-white p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">
          Categoria:
        </label>
        <select
          id="category"
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          onChange={handleChange}
          value={activity.category}
        >
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad:
        </label>

        <input
          type="text"
          id="name"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas Bicicleta"
          onChange={handleChange}
          value={activity.name}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Calorias:
        </label>

        <input
          type="number"
          id="calories"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Calorias. ej. 300 o 500"
          onChange={handleChange}
          value={activity.calories}
        />
      </div>

      <input
        type="submit"
        value={activity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio"}
        className="bg-gray-800 hover:bg-gray 900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
        disabled={!isValidActivity()}
      />
    </form>
  );
};

import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import EtudiantList from "../components/EtudiantList";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Select from "../../shared/components/FormElements/Select";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./EtudiantForm.css";

const NewEtudiant = () => {
  const { error, sendRequest, clearError } = useHttpClient();
  const [isFormVisible, setFormVisible] = useState(false);
  const toggleFormVisibility = () => {
    setFormVisible((prevIsFormVisible) => !prevIsFormVisible);
  };
  const [formState, inputHandler] = useForm(
    {
      DA: {
        value: "",
        isValid: false,
      },
      nom: {
        value: "",
        isValid: false,
      },
      courriel: {
        value: "",
        isValid: false,
      },
      profil: {
        value: "",
        isValid: false,
      }
    },
    false
  );

  const history = useHistory();

  const etudiantSubmitHandler = async (event) => {
    event.preventDefault();

    setFormVisible(false);

    const dataToSend = JSON.stringify({
      DA: formState.inputs.DA.value,
      nom: formState.inputs.nom.value,
      courriel: formState.inputs.courriel.value,
      profil: formState.inputs.profil.value
    });


    try {
      const reponseData = await sendRequest(
        "https://projetstages.onrender.com/api/etudiant/",
        "POST",
        dataToSend,
        {
          "Content-Type": "application/json",
        }
      );

      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Button onClick={toggleFormVisibility}>
        {isFormVisible ? "Masquer le formulaire" : "Afficher le formulaire"}
      </Button>



      {isFormVisible && (
            <form className="etudiant-form" onSubmit={etudiantSubmitHandler}>
              <Input
                id="DA"
                element="input"
                type="text"
                label="Numéro de DA"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Entrez un matricule valide."
                onInput={inputHandler}
              />
              <Input
                id="nom"
                element="input"
                type="text"
                label="Nom etudiant"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Entrez un nom valide."
                onInput={inputHandler}
              />
              <Input
                id="courriel"
                element="input"
                type="email"
                label="Courriel de l'étudiant"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                errorText="Entrez un courriel valide."
                onInput={inputHandler}
              />
              <Select
                id="profil"
                label="Profil de Sortie"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Veuillez sélectionner le profil."
                onInput={inputHandler}
              />
              <Button type="submit">Ajouter Etudiant</Button>
            </form>
            
      )}
            <EtudiantList />
    </React.Fragment>
  );
};

export default NewEtudiant;

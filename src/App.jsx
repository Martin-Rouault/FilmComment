import { useEffect, useState } from "react";
import {
    Card,
    Button,
    Form,
    Alert,
    ListGroup,
    Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { selectComments } from "./store/selectors";
import { deleteComment, addComment } from "./store/commentSlice";

const schema = yup.object().shape({
    comment: yup.string().required("Le commentaire est requis"),
    note: yup
        .number()
        .required("La note est requise")
        .min(1, "La note doit être au moins 1")
        .max(5, "La note doit être au maximum 5"),
    acceptConditions: yup
        .boolean()
        .oneOf([true], "Vous devez accepter les conditions")
        .required(),
});

function App() {
    const [movieInfo, setMovieInfo] = useState(null);
    const dispatch = useDispatch();
    const comments = useSelector(selectComments);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        async function fetchMovie() {
            const url = "https://jsonfakery.com/movies/random/1";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }
                const data = await response.json();
                setMovieInfo(data[0]);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchMovie();
    }, []);

    const onSubmit = (data) => {
        dispatch(addComment({ comment: data.comment, note: data.note }));
        reset();
    };

    return (
        <Container className="mt-4">
            {movieInfo && (
                <Card>
                    <Card.Img
                        variant="top"
                        src={movieInfo.poster_path}
                        alt="Movie Banner"
                        className="card-img"
                    />
                    <Card.Body>
                        <Card.Title>{movieInfo.original_title}</Card.Title>
                        <Card.Text>
                            Sortie le : {movieInfo.release_date}
                        </Card.Text>
                        <Card.Text>{movieInfo.overview}</Card.Text>
                        <Card.Text>
                            Note moyenne : {movieInfo.vote_average} (
                            {movieInfo.vote_count} votes)
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <div className="mt-4">
                <h4>Commentaires</h4>
                {comments.length === 0 ? (
                    <Alert variant="info">
                        Aucun commentaire pour le moment.
                    </Alert>
                ) : (
                    <ListGroup>
                        {comments.map((comment) => (
                            <ListGroup.Item
                                key={comment.id}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>
                                    {comment.comment} (Note: {comment.note})
                                </span>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        dispatch(deleteComment(comment.id))
                                    }
                                >
                                    Supprimer
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>
            <div className="mt-3">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Ajouter un commentaire"
                            {...register("comment")}
                        />
                        <p className="text-danger">{errors.comment?.message}</p>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Select {...register("note")}>
                            <option value="">Choisir une note</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Select>
                        <p className="text-danger">{errors.note?.message}</p>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Check
                            type="checkbox"
                            label="J'accepte les conditions"
                            {...register("acceptConditions")}
                        />
                        <p className="text-danger">
                            {errors.acceptConditions?.message}
                        </p>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ajouter
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default App;

from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True, related_name="followers", symmetrical=False)


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "following": [user.id for user in self.following.all()],
            "followers": [user.id for user in self.followers.all()]
        }

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="likes", default=None, blank=True)

    def __str__(self):
        return f'Post Id: {self.id},  Author: {self.author} - Content: {self.body[:50]}.., TimeStamp: {self.timestamp.strftime("%b %d %Y, %I:%M %p")}, Likes: {(self.likes.count())}'

    def serialize(self):
        return {
            "post_id": self.id,
            "author_id": self.author.id,
            "author_username": self.author.username,
            "author_fullname": f"{self.author.first_name} {self.author.last_name}",
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": [user.id for user in self.likes.all()]
        }

from rest_framework import serializers
from accounts.models import User
from .models import FeeStructure, FeePayment


class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'


class FeePaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    fee_name = serializers.SerializerMethodField()
    student = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'),
        required=False,
    )

    class Meta:
        model = FeePayment
        fields = '__all__'
        read_only_fields = ['created_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_fee_name(self, obj):
        return obj.fee_structure.name if obj.fee_structure else ''
